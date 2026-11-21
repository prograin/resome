import { awards, courses } from "./schema/learning.js";
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
  const [assignment] = await tx.insert(courses).values(values).returning({ id: courses.id });
  await createStudentNotification(tx, {
    studentId: values.studentId,
    kind: "course",
    entityId: assignment.id,
    courseTitle,
  });
  return assignment;
}
