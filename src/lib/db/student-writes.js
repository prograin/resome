import { and, eq } from "drizzle-orm";
import { courses, users, courseDefinitions } from "./schema/index.js";
import { eligibleStudent } from "./rankings.js";
import { addStudentAward, addStudentCourse } from "./student-records.js";

export function writeProgress(db, studentId, admin, operation, values) {
  return db.transaction(async (tx) => {
    const [student] = await tx
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.id, studentId), eligibleStudent(admin)))
      .for("update");
    if (!student) return false;
    if (operation === "course") {
      let definitionId = values.definitionId;
      let title = values.course.title;
      if (definitionId) {
        const [definition] = await tx
          .select({ id: courseDefinitions.id, title: courseDefinitions.title })
          .from(courseDefinitions)
          .where(eq(courseDefinitions.id, definitionId));
        if (!definition) return false;
        title = definition.title;
      } else {
        const [definition] = await tx
          .insert(courseDefinitions)
          .values({ ...values.course })
          .returning({ id: courseDefinitions.id });
        definitionId = definition.id;
      }
      await addStudentCourse(tx, { studentId, ...values.course, definitionId }, title);
      return true;
    }
    const ownCourse = and(eq(courses.id, values.courseId ?? 0), eq(courses.studentId, studentId));
    if (operation === "status")
      return (
        (
          await tx
            .update(courses)
            .set({ status: values.status })
            .where(ownCourse)
            .returning({ id: courses.id })
        ).length === 1
      );
    let title = null;
    if (values.courseId !== null) {
      const [course] = await tx
        .select({ id: courses.id, title: courseDefinitions.title })
        .from(courses)
        .innerJoin(courseDefinitions, eq(courseDefinitions.id, courses.definitionId))
        .where(ownCourse)
        .for("update", { of: courses });
      if (!course) return false;
      title = course.title;
    }
    await addStudentAward(
      tx,
      {
        studentId,
        courseId: values.courseId,
        points: values.points,
        kind: values.kind,
        note: values.note,
      },
      title,
    );
    return true;
  });
}
