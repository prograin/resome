import { and, eq } from "drizzle-orm";
import { awards, courses, users, courseDefinitions } from "./schema/index.js";
import { eligibleStudent } from "./rankings.js";

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
      if (definitionId) {
        const [definition] = await tx
          .select({ id: courseDefinitions.id })
          .from(courseDefinitions)
          .where(eq(courseDefinitions.id, definitionId));
        if (!definition) return false;
      } else {
        const [definition] = await tx
          .insert(courseDefinitions)
          .values({ ...values.course })
          .returning({ id: courseDefinitions.id });
        definitionId = definition.id;
      }
      await tx.insert(courses).values({ studentId, ...values.course, definitionId });
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
    if (values.courseId !== null) {
      const [course] = await tx
        .select({ id: courses.id })
        .from(courses)
        .where(ownCourse)
        .for("update");
      if (!course) return false;
    }
    await tx.insert(awards).values({
      studentId,
      courseId: values.courseId,
      points: values.points,
      kind: values.kind,
      note: values.note,
    });
    return true;
  });
}
