import assert from "node:assert/strict";
import { count, eq, sql } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import {
  users,
  courses,
  awards,
  weeklyRuns,
  weeklyStats,
  courseDefinitions,
} from "../src/lib/db/schema/index.js";
import { captureWeeklyStats, readWeeklyStats } from "../src/lib/student-weekly.js";
import { rankingPolicy } from "../src/lib/scoring/policy.js";
import { weeklyChange } from "../src/features/students/weekly-copy.js";
import { currentStudentCourse } from "../src/lib/student-current-course.js";
import { checkCourseLeaders } from "./students/course-leaders-data.mjs";
import { previousStudentWeek, startOfStudentWeek } from "../src/lib/db/weekly-calendar.js";

const { db, close } = await createTestDatabase("weekly");
try {
  await migrateStudentDatabase(db);
  await migrateStudentDatabase(db);
  await db.insert(users).values([
    ...Array.from({ length: 12 }, (_, index) => ({
      id: String(index + 1),
      username: `user${index + 1}`,
      name: "Fixture",
      email: `fixture${index + 1}@example.test`,
    })),
    { id: "admin", username: "teacher", name: "Teacher", email: "teacher@example.test" },
  ]);
  const [definitionA, definitionB] = await db
    .insert(courseDefinitions)
    .values([
      { title: "A", difficulty: "intermediate", sharedContent: true },
      { title: "B", difficulty: "advanced", sharedContent: true },
    ])
    .returning();
  const [a, b, c] = await db
    .insert(courses)
    .values([
      { studentId: "1", title: "A", definitionId: definitionA.id },
      { studentId: "1", title: "B", definitionId: definitionB.id },
      { studentId: "2", title: "B", definitionId: definitionB.id },
    ])
    .returning();
  await db.insert(awards).values([
    { studentId: "1", courseId: b.id, points: 4, kind: "other" },
    { studentId: "2", courseId: c.id, points: 5, kind: "other" },
    { studentId: "admin", points: 5, kind: "other" },
  ]);
  await db.insert(courses).values([
    { studentId: "2", title: "A", definitionId: definitionA.id },
    ...Array.from({ length: 10 }, (_, index) => [
      { studentId: String(index + 3), title: "A", definitionId: definitionA.id },
      { studentId: String(index + 3), title: "B", definitionId: definitionB.id },
    ]).flat(),
  ]);
  await db.insert(awards).values(
    (await db.select().from(courses))
      .filter((row) => !["1", "2"].includes(row.studentId) && row.definitionId === definitionB.id)
      .map((row) => ({
        studentId: row.studentId,
        courseId: row.id,
        points: 1,
        kind: "other",
      })),
  );
  const concurrent = await Promise.all([
    captureWeeklyStats(db, "teacher"),
    captureWeeklyStats(db, "teacher"),
  ]);
  assert.equal(concurrent.filter((run) => run.created).length, 1);
  const first = concurrent.find((run) => run.created);
  assert.equal(first.students, 12);
  assert.equal((await captureWeeklyStats(db, "teacher")).created, false);
  let result = await readWeeklyStats(db, "1");
  assert.equal(result.stats.overallRank, 2);
  assert.equal(result.stats.courseRank, 2);
  assert.equal(result.stats.courseId, b.id);
  assert.equal(result.leaders.length, 10);
  assert.deepEqual(
    result.leaders.map((row) => row.overallRank),
    Array.from({ length: 10 }, (_, index) => index + 1),
  );
  assert.deepEqual((await readWeeklyStats(db, "2")).leaders, result.leaders);
  assert.deepEqual((await readWeeklyStats(db, "1")).leaders, result.leaders);
  assert.ok(result.leaders.every((row) => Object.keys(row).length === 4));
  assert.equal(result.stats.previousRank, null);
  assert.equal(
    result.leaders.some((row) => row.username === "teacher"),
    false,
  );
  assert.equal((await readWeeklyStats(db, "unknown")).stats, null);
  const previous = previousStudentWeek(first.week);
  await db.insert(weeklyRuns).values({ week: previous, policyVersion: rankingPolicy.version });
  await db.update(weeklyStats).set({ week: previous }).where(eq(weeklyStats.week, first.week));
  await db.delete(weeklyRuns).where(eq(weeklyRuns.week, first.week));
  await db.insert(awards).values({ studentId: "2", courseId: c.id, points: 1, kind: "other" });
  await captureWeeklyStats(db, "teacher");
  result = await readWeeklyStats(db, "1");
  assert.equal(result.stats.previousRank, 2);
  assert.equal(result.stats.overallRank, 1);
  assert.equal(Number(result.stats.previousAverage), 4);
  assert.equal(weeklyChange(2, 1, "rank", "fa").tone, "negative");
  assert.equal(weeklyChange(1, 3, "rank", "fa").tone, "positive");
  assert.ok(weeklyChange(4, 2, "average", "en").text.includes("100"));
  assert.ok(!weeklyChange(4, 0, "average", "en").text.includes("Infinity"));
  assert.equal(weeklyChange(1, null, "rank", "fa").tone, "neutral");
  assert.equal(weeklyChange(1, 1, "rank", "fa").tone, "neutral");
  assert.equal(weeklyChange(1, 3, "rank", "en", true).text, "2");
  assert.equal(weeklyChange(1, 3, "rank", "fa", true).text, "۲");
  assert.equal(weeklyChange(1, 3, "rank", "en", true).label, "2 places up from last week");
  assert.equal(weeklyChange(1, 1, "rank", "fa", true).text, "۰");
  assert.equal(weeklyChange(1, null, "rank", "fa", true).text, "—");
  assert.equal(weeklyChange(NaN, 1, "rank", "fa", true).tone, "neutral");
  assert.equal(
    currentStudentCourse([
      { id: b.id, status: "completed" },
      { id: a.id, status: "active" },
    ]).id,
    b.id,
  );
  assert.equal(currentStudentCourse([]), null);
  assert.equal(startOfStudentWeek(new Date("2026-11-20T20:29:59Z")), "2026-11-14");
  assert.equal(startOfStudentWeek(new Date("2026-11-20T20:30:00Z")), "2026-11-21");
  await db.delete(weeklyRuns).where(eq(weeklyRuns.week, first.week));
  await db.execute(
    sql`alter table student_weekly_stat add constraint fail_batch check (assessments < 0) not valid`,
  );
  await assert.rejects(captureWeeklyStats(db, "teacher"));
  assert.equal((await db.select({ value: count() }).from(weeklyRuns))[0].value, 1);
  await checkCourseLeaders(db);
  console.log(
    "PASS ORM fresh migrations, ranking, student isolation, weekly history, Tehran calendar, idempotency and atomic rollback.",
  );
} finally {
  await close();
}
