import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import {
  users,
  courses,
  awards,
  courseDefinitions,
  weeklyRuns,
  weeklyStats,
} from "../src/lib/db/schema/index.js";
import { studentRankings } from "../src/lib/db/rankings.js";
import { readCourses } from "../src/lib/db/student-courses.js";
import { captureWeeklyStats, readWeeklyStats } from "../src/lib/student-weekly.js";
import { weeklyBaseline } from "../src/lib/scoring/weekly-baseline.js";
import { rankingPolicy, legacyRankingPolicy } from "../src/lib/scoring/policy.js";
import { startOfStudentWeek, previousStudentWeek } from "../src/lib/db/weekly-calendar.js";

const { db, close } = await createTestDatabase("scoring");
const now = new Date("2026-11-19T12:00:00Z");
const day = 86400000;
try {
  await migrateStudentDatabase(db);
  const ids = ["first", "best", "many", "tied", "empty", "old", "teacher"];
  await db
    .insert(users)
    .values(ids.map((id) => ({ id, name: id, username: id, email: `${id}@example.test` })));
  const [definition] = await db
    .insert(courseDefinitions)
    .values({ title: "Shared course" })
    .returning();
  const assigned = await db
    .insert(courses)
    .values(
      ids.flatMap((studentId) =>
        Array.from({ length: studentId === "first" ? 1 : 2 }, (_, i) => ({
          studentId,
          definitionId: definition.id,
          title: `${studentId}-${i}`,
          difficulty: studentId === "first" ? "advanced" : "beginner",
        })),
      ),
    )
    .returning();
  const courseFor = (id) => assigned.findLast((row) => row.studentId === id).id;
  const grade = (studentId, points, recordedAt = now.toISOString()) => ({
    studentId,
    points,
    courseId: courseFor(studentId),
    kind: "other",
    recordedAt,
  });
  await db
    .insert(awards)
    .values([
      grade("first", 5),
      grade("best", 5),
      grade("tied", 5),
      grade("many", 4),
      grade("many", 4),
      grade("many", 4),
      grade("old", 5),
      grade("teacher", 5),
      grade("best", 1, new Date(now.getTime() + day).toISOString()),
    ]);
  const scores = async (asOf = now) =>
    new Map((await studentRankings(db, "teacher", asOf)).map((s) => [s.studentId, s]));
  let rows = await scores();
  assert.equal(rows.has("teacher"), false);
  assert.equal(rows.get("first").overallEligible, false);
  assert.equal(rows.get("first").overallRank, null);
  assert.equal(rows.get("first").courseRank, 1);
  assert.equal(rows.get("empty").average, null);
  assert.equal(rows.get("empty").overallRank, null);
  assert.equal(rows.get("empty").courseRank, null);
  assert.equal(rows.get("best").overallRank, 1);
  assert.equal(rows.get("tied").overallRank, 1);
  assert.equal(rows.get("many").overallRank, 4);
  assert.equal(rows.get("many").courseRank, 5);
  assert.equal(Number(rows.get("best").rawAverage), 5);
  assert.equal(rows.get("best").assessments, 1);
  const before = (await readWeeklyStats(db, "first", "teacher", now)).leaders;
  assert.equal(before.length, 4);
  assert.ok(before.every((r) => !["first", "teacher", "empty"].includes(r.username)));
  const oldAward = (await db.select().from(awards).where(eq(awards.studentId, "old")))[0];
  for (const [days, expected, months] of [
    [0, 5, 0],
    [29.999, 5, 0],
    [30, 4.9, 1],
    [60, 4.7, 2],
    [90, 4.3, 3],
    [120, 3.5, 4],
    [150, 1.9, 5],
    [180, 0, 6],
    [36500, 0, 1216],
  ]) {
    await db
      .update(awards)
      .set({ recordedAt: new Date(now.getTime() - days * day).toISOString() })
      .where(eq(awards.id, oldAward.id));
    rows = await scores();
    const old = rows.get("old");
    assert.equal(Number(old.average), expected, `average after ${days} days`);
    assert.equal(old.inactiveMonths, months);
    assert.equal(Number(old.rawAverage), 5);
    assert.ok(Math.abs(Number(old.inactivityPenalty) - (5 - expected)) < 1e-9);
    assert.equal(old.courseRank, 1, "inactivity must not decay course rank");
    assert.ok(old.overallRank != null, "zero still has an overall rank");
  }
  await db.insert(awards).values({ ...grade("old", 3), courseId: null });
  rows = await scores();
  assert.equal(Number(rows.get("old").average), 4);
  assert.equal(rows.get("old").inactiveMonths, 0);
  assert.equal(rows.get("old").assessments, 2);
  const ownCourses = (await readCourses(db, "many", "teacher", now)).courses;
  assert.equal(Number(ownCourses[0].average), 4);
  assert.equal(ownCourses[0].total, "12", "original grades preserved");

  const week = startOfStudentWeek(now);
  await db.insert(weeklyRuns).values({ week });
  await db.insert(weeklyStats).values({
    week,
    studentId: "best",
    average: "1",
    assessments: 1,
    weightedPoints: 999,
    overallRank: 99,
  });
  await captureWeeklyStats(db, "teacher", now);
  assert.equal((await captureWeeklyStats(db, "teacher", now)).created, false);
  const snapshots = await db.select().from(weeklyRuns);
  assert.deepEqual(
    new Set(snapshots.map((r) => r.policyVersion)),
    new Set([legacyRankingPolicy, rankingPolicy.version]),
  );
  const result = await readWeeklyStats(db, "best", "teacher", now);
  assert.equal(result.stats.overallRank, 1);
  assert.equal(result.stats.previousRank, null, "old policy is never a baseline");
  assert.equal(result.stats.assessments, 1);
  assert.equal(Number(result.stats.rawAverage), 5);
  assert.equal(
    (
      await db.select().from(weeklyStats).where(eq(weeklyStats.policyVersion, legacyRankingPolicy))
    )[0].overallRank,
    99,
  );
  const first = await readWeeklyStats(db, "first", "teacher", now);
  assert.equal(first.stats.overallRank, null);
  assert.equal(first.stats.courseRank, 1);
  assert.equal(weeklyBaseline({ week: previousStudentWeek(week), average: "3" }, now).average, "3");
  assert.equal(weeklyBaseline({ week, previousAverage: "2" }, now).average, "2");
  assert.equal(weeklyBaseline({ week: "2020-01-01" }, now), null);
  assert.equal(weeklyBaseline(null, now), null);
  await db.insert(courses).values({
    studentId: "first",
    definitionId: definition.id,
    title: "Second",
    difficulty: "beginner",
  });
  assert.equal((await scores()).get("first").overallEligible, true);
  assert.equal((await scores()).get("first").overallRank, 1);
  console.log(
    "PASS average ranks, first-course exclusion, ties, future dates, decay boundaries/reset, preserved grades, versioned weekly history and baseline selection.",
  );
} finally {
  await close();
}
