import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { bigint, date, integer, numeric, pgTable, text } from "drizzle-orm/pg-core";
import { createTestDatabase } from "./lib/test-database.mjs";
import { migrateBeforeCourseDefinitions } from "./lib/previous-schema.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import {
  users,
  courses,
  awards,
  courseDefinitions,
  weeklyStats,
} from "../src/lib/db/schema/index.js";
import { readCourses, updateCourseContent } from "../src/lib/db/student-courses.js";
import { writeProgress } from "../src/lib/db/student-writes.js";
import { courseInput } from "../src/lib/validation/courses.js";
import { captureWeeklyStats, readWeeklyStats } from "../src/lib/student-weekly.js";

const legacyCourses = pgTable("student_course", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  studentId: text("student_id"),
  title: text(),
});
const legacyRuns = pgTable("student_weekly_run", { week: date() });
const legacyStats = pgTable("student_weekly_stat", {
  week: date(),
  studentId: text("student_id"),
  average: numeric(),
  assessments: integer(),
  weightedPoints: bigint("weighted_points", { mode: "number" }),
  overallRank: bigint("overall_rank", { mode: "number" }),
});
const { db: legacyDb, pool, close } = await createTestDatabase("course_ranks");
let db = legacyDb;
try {
  await migrateBeforeCourseDefinitions(db);
  await db.insert(users).values([
    { id: "a", name: "Alice", username: "alice", email: "a@example.test" },
    { id: "b", name: "Bob", username: "bob", email: "b@example.test" },
  ]);
  const [a, b, repeated] = await db
    .insert(legacyCourses)
    .values([
      { studentId: "a", title: "Python" },
      { studentId: "b", title: "Python" },
      { studentId: "a", title: "Python" },
    ])
    .returning();
  await db.insert(awards).values([
    { studentId: "a", courseId: a.id, points: 1, kind: "other" },
    { studentId: "b", courseId: b.id, points: 4, kind: "other" },
    { studentId: "a", courseId: repeated.id, points: 5, kind: "other" },
  ]);
  await db.insert(legacyRuns).values({ week: "2026-01-03" });
  await db.insert(legacyStats).values({
    week: "2026-01-03",
    studentId: "a",
    average: "3",
    assessments: 2,
    weightedPoints: 12,
    overallRank: 1,
  });
  db = drizzle(pool);
  await migrateStudentDatabase(db);
  await migrateStudentDatabase(db);
  const [saved] = await db.select().from(weeklyStats);
  assert.equal(saved.policyVersion, "weighted-total-v1");
  assert.equal(saved.weightedPoints, 12);
  assert.equal(saved.overallRank, 1);
  const readA = async () =>
    (await readCourses(db, "a", null)).courses.find((course) => course.id === a.id);
  const before = await readA();
  assert.equal(before.total, "1");
  assert.equal(before.rank, 3);
  assert.equal((await db.select().from(courseDefinitions)).length, 1);
  assert.equal((await db.select().from(awards)).length, 3);
  const updated = courseInput.parse({ title: "Renamed", definitionId: "999" });
  await updateCourseContent(db, "a", a.id, "course", updated);
  const after = await readA();
  assert.equal(after.definitionId, before.definitionId);
  assert.equal(after.rank, before.rank);
  assert.equal(after.total, before.total);
  assert.equal(
    await writeProgress(db, "b", null, "course", { course: updated, definitionId: 99999 }),
    false,
  );
  await writeProgress(db, "b", null, "course", {
    course: courseInput.parse({ title: "Python" }),
    definitionId: null,
  });
  const independent = (await readCourses(db, "b", null)).courses[0];
  assert.notEqual(independent.definitionId, before.definitionId);
  assert.equal(independent.rank, null);
  await writeProgress(db, "a", null, "course", {
    course: updated,
    definitionId: independent.definitionId,
  });
  assert.equal(
    (await readCourses(db, "a", null)).courses[0].definitionId,
    independent.definitionId,
  );
  await captureWeeklyStats(db);
  assert.equal((await readWeeklyStats(db, "a")).stats.courseRank, null);
  console.log(
    "PASS course IDs: legacy upgrade, preserved awards, rename-stable ranks, separate assignments and weekly stats.",
  );
} finally {
  await close();
}
