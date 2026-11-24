import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import { users, awards, courseDefinitions, courses } from "../src/lib/db/schema/index.js";
import {
  readAdminCourse,
  readAdminCourses,
  writeAdminCourse,
} from "../src/lib/db/admin-courses.js";
import { readCourses } from "../src/lib/db/student-courses.js";
import { hasCourseScoreToday } from "../src/lib/db/course-score-today.js";

const { db, close } = await createTestDatabase("admin_courses");
try {
  await migrateStudentDatabase(db);
  await db.insert(users).values(
    ["alice", "bob", "teacher"].map((id) => ({
      id,
      username: id,
      name: id,
      email: `${id}@example.test`,
      firstName: id,
      lastName: "Student",
    })),
  );
  const [a, b] = await db
    .insert(courseDefinitions)
    .values([{ title: "Course A" }, { title: "Course B" }])
    .returning();
  const write = (operation, id, values, definitionId = a.id) =>
    writeAdminCourse(db, "teacher", definitionId, operation, id, values);
  assert.equal((await readAdminCourse(db, "teacher", a.id)).candidates.length, 2);
  const results = await Promise.all([
    write("enroll", null, { studentId: "alice" }),
    write("enroll", null, { studentId: "alice" }),
  ]);
  assert.deepEqual(results.sort(), ["duplicateEnrollment", "saved"]);
  const [assignment] = await db.select().from(courses).where(eq(courses.studentId, "alice"));
  assert.equal((await readAdminCourse(db, "teacher", a.id, true)).enrollments.length, 1);
  assert.equal(
    (await readAdminCourse(db, "teacher", a.id, true)).enrollments[0].scoredToday,
    false,
  );
  assert.deepEqual(
    (await readAdminCourse(db, "teacher", a.id)).candidates.map((s) => s.id),
    ["bob"],
  );
  assert.equal(await write("enroll", null, { studentId: "teacher" }), "invalid");
  assert.equal(await write("enroll", null, { studentId: "missing" }), "invalid");
  const grade = { points: 4, note: "Good progress", kind: "session" };
  assert.equal(await write("grade", assignment.id, grade, b.id), "invalid");
  assert.equal(await write("grade", assignment.id, grade), "saved");
  const graded = (await readAdminCourse(db, "teacher", a.id)).enrollments[0];
  assert.equal(Number(graded.average), 4);
  assert.equal(graded.rank, 1);
  assert.equal(graded.scoredToday, true);
  let history = await db.select().from(awards);
  assert.equal(history.length, 1);
  assert.equal(history[0].studentId, "alice");
  assert.equal(history[0].courseId, assignment.id);
  assert.equal(history[0].note, grade.note);
  assert.equal(await write("status", assignment.id, { status: "inactive" }), "saved");
  assert.equal((await readAdminCourse(db, "teacher", a.id)).enrollments[0].status, "inactive");
  assert.equal((await readAdminCourse(db, "teacher", a.id, true)).enrollments.length, 0);
  assert.equal(await write("grade", assignment.id, grade), "inactiveEnrollment");
  assert.equal((await readCourses(db, "alice", "teacher")).courses[0].status, "inactive");
  assert.equal(await write("status", assignment.id, { status: "completed" }), "saved");
  assert.equal((await readAdminCourse(db, "teacher", a.id, true)).enrollments.length, 0);
  assert.equal((await readAdminCourse(db, "teacher", a.id)).enrollments[0].status, "completed");
  assert.equal(await write("grade", assignment.id, grade), "inactiveEnrollment");
  assert.equal((await db.select().from(awards)).length, 1);
  const studentCourses = (await readCourses(db, "alice", "teacher")).courses;
  assert.equal(studentCourses.length, 1, "completed course remains visible to student");
  assert.equal(studentCourses[0].status, "completed");
  assert.equal(Number(studentCourses[0].average), 4);
  let catalog = await readAdminCourses(db, "teacher");
  assert.equal(catalog.find((c) => c.id === a.id).active, 0);
  assert.equal(catalog.find((c) => c.id === a.id).completed, 1);
  assert.equal(await write("status", assignment.id, { status: "active" }), "saved");
  assert.equal((await readAdminCourse(db, "teacher", a.id, true)).enrollments.length, 1);
  await db.insert(courses).values({ studentId: "teacher", definitionId: a.id, title: a.title });
  catalog = await readAdminCourses(db, "teacher");
  assert.equal(catalog.find((c) => c.id === a.id).active, 1, "teacher excluded");
  assert.equal((await readAdminCourse(db, "teacher", a.id)).enrollments.length, 1);
  assert.equal(await readAdminCourse(db, "teacher", 999999), null);
  assert.equal(await write("enroll", null, { studentId: "bob" }), "saved");
  const bob = (await readAdminCourse(db, "teacher", a.id)).enrollments.find(
    (row) => row.studentId === "bob",
  );
  assert.equal(bob.average, null);
  assert.equal(bob.rank, null);
  assert.equal(await write("grade", bob.id, { ...grade, points: 5 }), "saved");
  const ranked = (await readAdminCourse(db, "teacher", a.id)).enrollments;
  assert.equal(ranked.find((row) => row.studentId === "bob").rank, 1);
  assert.equal(ranked.find((row) => row.studentId === "alice").rank, 2);
  for (const [recordedAt, expected] of [
    ["2026-11-23T20:29:59Z", false],
    ["2026-11-23T20:30:00Z", true],
    ["2026-11-24T12:00:00Z", true],
    ["2026-11-24T20:30:00Z", false],
  ]) {
    await db.update(awards).set({ recordedAt }).where(eq(awards.studentId, "alice"));
    const [result] = await db
      .select({ recorded: hasCourseScoreToday(db, new Date("2026-11-24T20:29:59Z")) })
      .from(courses)
      .where(eq(courses.id, assignment.id));
    assert.equal(result.recorded, expected, `Tehran day boundary: ${recordedAt}`);
  }
  console.log(
    "PASS concurrent enrollment, active-only grading, completed-course visibility, preserved grades, reactivation, course isolation and teacher exclusion.",
  );
} finally {
  await close();
}
