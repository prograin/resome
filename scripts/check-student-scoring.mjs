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
import { rankingPolicy, legacyRankingPolicy } from "../src/lib/scoring/policy.js";
import { startOfStudentWeek } from "../src/lib/db/weekly-calendar.js";

const { db, close } = await createTestDatabase("scoring");
const now = new Date("2026-11-19T12:00:00Z");
try {
  await migrateStudentDatabase(db);
  const ids = [
    "beginner",
    "first",
    "best",
    "tied",
    "mixed",
    "empty",
    "general",
    "unknown",
    "teacher",
    "inactive",
    "banned",
  ];
  await db.insert(users).values(
    ids.map((id) => ({
      id,
      name: id,
      username: id,
      email: `${id}@example.test`,
      academyActive: !["inactive", "banned"].includes(id),
      academyBanned: id === "banned",
    })),
  );
  const definitions = await db
    .insert(courseDefinitions)
    .values(
      ["beginner", "intermediate", "advanced", null].map((difficulty) => ({
        title: difficulty || "Unspecified",
        difficulty,
        sharedContent: true,
      })),
    )
    .returning();
  const enroll = async (studentId, level) => {
    const definition = definitions.find((row) => row.difficulty === level);
    const [course] = await db
      .insert(courses)
      .values({
        studentId,
        definitionId: definition.id,
        title: definition.title,
        difficulty: "advanced",
      })
      .returning();
    return course;
  };
  const grade = (studentId, points, courseId = null, recordedAt = now.toISOString()) =>
    db.insert(awards).values({ studentId, courseId, points, kind: "other", recordedAt });
  const assigned = new Map();
  for (const [id, level, points] of [
    ["beginner", "beginner", 5],
    ["first", "intermediate", 4],
    ["best", "advanced", 5],
    ["tied", "advanced", 5],
    ["mixed", "intermediate", 3],
    ["unknown", null, 5],
    ["teacher", "advanced", 5],
    ["inactive", "advanced", 5],
    ["banned", "advanced", 5],
  ]) {
    const course = await enroll(id, level);
    assigned.set(id, course);
    await grade(id, points, course.id);
  }
  await grade("general", 5);
  const mixedBeginner = await enroll("mixed", "beginner");
  await grade("mixed", 5, mixedBeginner.id);
  await grade("mixed", 5);
  await grade("best", 1, assigned.get("best").id, "2026-11-20T12:00:00Z");
  const scores = async (asOf = now) =>
    new Map((await studentRankings(db, "teacher", asOf)).map((row) => [row.studentId, row]));
  let rows = await scores();
  for (const id of ["teacher", "inactive", "banned"]) assert.equal(rows.has(id), false);
  for (const id of ["beginner", "general", "unknown", "empty"]) {
    assert.equal(rows.get(id).overallRank, null);
    assert.equal(rows.get(id).overallEligible, false);
  }
  assert.equal(rows.get("first").overallRank, 3, "first intermediate course qualifies");
  assert.equal(rows.get("first").courseCount, 1);
  assert.equal(Number(rows.get("mixed").overallAverage), 3);
  assert.ok(Math.abs(Number(rows.get("mixed").average) - 13 / 3) < 1e-9);
  assert.equal(
    rows.get("mixed").assessments,
    3,
    "all grades remain visible in personal statistics",
  );
  const weekly = await readWeeklyStats(db, "first", "teacher", now);
  assert.deepEqual(
    weekly.leaders.map((row) => row.username),
    ["best", "tied", "first", "mixed"],
  );
  assert.deepEqual(
    weekly.leaders.map((row) => row.overallRank),
    [1, 2, 3, 4],
  );
  assert.equal(Number(weekly.leaders.at(-1).average), 3);
  assert.equal((await readCourses(db, "beginner", "teacher", now)).courses[0].rank, 1);
  const later = (await scores(new Date("2027-05-19T12:00:00Z"))).get("first");
  assert.equal(Number(later.average), 4, "no monthly score decay");
  assert.equal(Number(later.inactivityPenalty), 0);
  const before = weekly.leaders;
  await grade("beginner", 5, assigned.get("beginner").id);
  assert.deepEqual((await readWeeklyStats(db, "first", "teacher", now)).leaders, before);
  const beginnerDefinition = definitions.find((row) => row.difficulty === "beginner");
  await db
    .update(courseDefinitions)
    .set({ difficulty: "advanced" })
    .where(eq(courseDefinitions.id, beginnerDefinition.id));
  assert.equal(
    (await scores()).get("beginner").overallEligible,
    true,
    "shared level edits apply live",
  );
  await db
    .update(courseDefinitions)
    .set({ difficulty: "beginner" })
    .where(eq(courseDefinitions.id, beginnerDefinition.id));
  const week = startOfStudentWeek(now);
  await db.insert(weeklyRuns).values({ week, policyVersion: legacyRankingPolicy });
  await db.insert(weeklyStats).values({ week, studentId: "best", assessments: 1, overallRank: 99 });
  assert.equal((await captureWeeklyStats(db, "teacher", now)).created, true);
  assert.equal((await captureWeeklyStats(db, "teacher", now)).created, false);
  const result = await readWeeklyStats(db, "best", "teacher", now);
  assert.equal(result.stats.overallRank, 1);
  assert.equal(result.stats.previousRank, null);
  assert.deepEqual(
    new Set((await db.select().from(weeklyRuns)).map((row) => row.policyVersion)),
    new Set([legacyRankingPolicy, rankingPolicy.version]),
  );
  console.log(
    "PASS course-level ranking, first-course inclusion, beginner/general/unknown exclusion, separate personal average, level edits, unique ranks, no decay, account states and versioned snapshots.",
  );
} finally {
  await close();
}
