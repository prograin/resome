import { awards, courses } from "./schema/learning.js";
import { and, eq } from "drizzle-orm";
import { createStudentNotification } from "../notifications/create.js";

export async function addStudentAward(tx, values, courseTitle = null) {
  const [award] = await tx.insert(awards).values(values).returning({ id: awards.id });
  await createStudentNotification(tx, {
    studentId: values.studentId,
    kind: "award",
    entityId: award.id,
    points: values.points,
    courseTitle,
  });
  return award;
}

export async function addStudentCourse(tx, values, courseTitle = values.title) {
  // Both enrollment writers lock the student row before checking or inserting.
  const [existing] = await tx
    .select({ id: courses.id })
    .from(courses)
    .where(
      and(eq(courses.studentId, values.studentId), eq(courses.definitionId, values.definitionId)),
    )
    .limit(1);
  if (existing) return null;
  const [assignment] = await tx.insert(courses).values(values).returning({ id: courses.id });
  await createStudentNotification(tx, {
    studentId: values.studentId,
    kind: "course",
    entityId: assignment.id,
    courseTitle,
  });
  return assignment;
}
