import { awards, courses } from "./schema/learning.js";
import { and, inArray } from "drizzle-orm";
import { createStudentNotification, createCourseNotifications } from "../notifications/create.js";

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
  const [assignment] = await addStudentCourses(tx, [values], courseTitle);
  return assignment ?? null;
}

export async function addStudentCourses(tx, values, courseTitle) {
  if (!values.length) return [];
  // Both enrollment writers lock the student row before checking or inserting.
  const existing = await tx
    .select({ studentId: courses.studentId, definitionId: courses.definitionId })
    .from(courses)
    .where(
      and(
        inArray(
          courses.studentId,
          values.map((row) => row.studentId),
        ),
        inArray(
          courses.definitionId,
          values.map((row) => row.definitionId),
        ),
      ),
    );
  const key = (row) => `${row.studentId}:${row.definitionId}`;
  const assigned = new Set(existing.map(key));
  const additions = values.filter((row) => !assigned.has(key(row)));
  if (!additions.length) return [];
  const assignments = await tx
    .insert(courses)
    .values(additions)
    .returning({ id: courses.id, studentId: courses.studentId });
  await createCourseNotifications(tx, assignments, courseTitle);
  return assignments;
}
