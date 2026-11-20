import { and, eq, inArray } from "drizzle-orm";
import {
  users,
  courses,
  courseDefinitions,
  definitionVideos,
  awards,
} from "../../src/lib/db/schema/index.js";
import { internalStudentEmail } from "../../src/lib/student-auth/student-email.js";
import { demoStudents, demoCourses, demoCourseIndexes, demoAssessments } from "./demo-data.mjs";

export async function seedAcademyDemo({ auth, db, password, now = new Date() }) {
  const existing = await db
    .select()
    .from(users)
    .where(
      inArray(
        users.username,
        demoStudents.map((s) => s.username),
      ),
    );
  for (const student of existing) {
    if (student.email !== internalStudentEmail(`academy-demo-${student.username}`))
      throw new Error(
        `Reserved demo username is already used by another account: ${student.username}`,
      );
  }
  if (
    demoStudents.some(
      (s) => s.username === process.env.STUDENT_ADMIN_USERNAME?.trim().toLowerCase(),
    )
  )
    throw new Error("A demo username cannot be the configured administrator.");
  const students = [];
  let createdUsers = 0;
  for (const student of demoStudents) {
    let account = existing.find((s) => s.username === student.username);
    if (!account) {
      const result = await auth.api.signUpEmail({
        body: {
          ...student,
          password,
          email: internalStudentEmail(`academy-demo-${student.username}`),
        },
      });
      account = result.user;
      createdUsers++;
    }
    students.push(account);
  }
  const added = await db.transaction(async (tx) => {
    await tx.select({ id: users.id }).from(users).where(eq(users.id, students[0].id)).for("update");
    const definitions = [];
    let createdCourses = 0,
      createdEnrollments = 0,
      createdAwards = 0,
      createdVideos = 0;
    for (const item of demoCourses) {
      const { video, ...content } = item;
      let [definition] = await tx
        .select()
        .from(courseDefinitions)
        .where(eq(courseDefinitions.title, item.title))
        .limit(1);
      if (!definition) {
        [definition] = await tx
          .insert(courseDefinitions)
          .values({ ...content, sharedContent: true })
          .returning();
        createdCourses++;
      }
      const inserted = await tx
        .insert(definitionVideos)
        .values({
          definitionId: definition.id,
          ...video,
          description: "لینک آموزشی نمونه برای نمایش منابع دورهٔ آزمایشی.",
        })
        .onConflictDoNothing()
        .returning({ id: definitionVideos.id });
      createdVideos += inserted.length;
      definitions.push(definition);
    }
    for (const [index, student] of students.entries()) {
      const indexes = demoCourseIndexes(index);
      const assigned = [];
      for (const [position, courseIndex] of indexes.entries()) {
        const definition = definitions[courseIndex];
        let [assignment] = await tx
          .select()
          .from(courses)
          .where(and(eq(courses.studentId, student.id), eq(courses.definitionId, definition.id)))
          .orderBy(courses.id)
          .limit(1);
        if (!assignment) {
          [assignment] = await tx
            .insert(courses)
            .values({
              studentId: student.id,
              definitionId: definition.id,
              title: definition.title,
              status: position < indexes.length - 1 ? "completed" : "active",
            })
            .returning();
          createdEnrollments++;
        }
        assigned.push(assignment);
      }
      const previous = await tx
        .select({ note: awards.note })
        .from(awards)
        .where(eq(awards.studentId, student.id));
      const notes = new Set(previous.map((row) => row.note));
      const fresh = demoAssessments(student, index, assigned, now).filter(
        (row) => !notes.has(row.note),
      );
      if (fresh.length) {
        await tx.insert(awards).values(fresh);
        createdAwards += fresh.length;
      }
    }
    return { createdCourses, createdEnrollments, createdAwards, createdVideos };
  });
  return { createdUsers, ...added, usernames: students.map((s) => s.username) };
}
