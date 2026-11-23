import { and, eq, inArray } from "drizzle-orm";
import { courseDefinitions, users } from "./schema/index.js";
import { eligibleStudent } from "./ranking-filters.js";
import { addStudentCourses } from "./student-records.js";
import { enrollmentStudentIdsInput } from "../validation/admin.js";

export async function enrollCourseStudents(db, admin, definitionId, studentIds) {
  if (!enrollmentStudentIdsInput.safeParse(studentIds).success) return "invalid";
  return db.transaction(async (tx) => {
    const [definition] = await tx
      .select()
      .from(courseDefinitions)
      .where(eq(courseDefinitions.id, definitionId))
      .for("no key update");
    if (!definition) return "invalid";
    const students = await tx
      .select({ id: users.id })
      .from(users)
      .where(and(inArray(users.id, studentIds), eligibleStudent(admin)))
      .orderBy(users.id)
      .for("update");
    if (students.length !== studentIds.length) return "invalid";
    const added = await addStudentCourses(
      tx,
      students.map((student) => ({
        studentId: student.id,
        definitionId,
        title: definition.title,
      })),
      definition.title,
    );
    return added.length ? "saved" : "duplicateEnrollment";
  });
}
