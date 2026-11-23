import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import {
  users,
  courses,
  awards,
  courseDefinitions,
  weeklyStats,
  notificationDeliveries,
} from "../../src/lib/db/schema/index.js";
import { writeProgress } from "../../src/lib/db/student-writes.js";
import { studentRankings } from "../../src/lib/db/rankings.js";
import { readCourses } from "../../src/lib/db/student-courses.js";
import { readAcademyAdmin } from "../../src/lib/db/academy-admin.js";
import { captureWeeklyStats } from "../../src/lib/db/capture-weekly.js";
import { processNotificationDeliveries } from "../../src/lib/notifications/delivery-worker.js";

export async function seedActivityData(db, fixture) {
  const { studentId, otherId, admin } = fixture;
  await db.update(users).set({ emailVerified: true }).where(eq(users.id, studentId));
  for (const title of ["Activity first course", "Activity second course"]) {
    const [definition] = await db
      .insert(courseDefinitions)
      .values({ title, github: "https://github.com/octocat", sharedContent: true })
      .returning();
    for (const id of [studentId, otherId]) {
      await writeProgress(db, id, admin, "course", {
        definitionId: definition.id,
        course: { title },
      });
      const own = await db.select().from(courses).where(eq(courses.studentId, id));
      await writeProgress(db, id, admin, "award", {
        courseId: own.at(-1).id,
        points: id === studentId ? 5 : 4,
        kind: "session",
        note: "Private activity score note",
      });
    }
  }
  const before = await studentRankings(db, admin);
  assert.equal(before.find((row) => row.studentId === studentId).overallRank, 1);
  assert.equal(before.find((row) => row.studentId === otherId).overallRank, 2);
}

export async function checkInactiveActivityData(db, fixture) {
  const { studentId, otherId, admin } = fixture;
  const ranks = await studentRankings(db, admin);
  assert.ok(!ranks.some((row) => row.studentId === studentId));
  assert.equal(ranks.find((row) => row.studentId === otherId).overallRank, 1);
  const otherCourses = await readCourses(db, otherId, admin);
  assert.ok(otherCourses.courses.every((course) => course.rank === 1));
  const directory = await readAcademyAdmin(db, admin);
  const student = directory.students.find((row) => row.id === studentId);
  assert.equal(student.academyActive, false);
  assert.equal(student.courseCount, 2);
  assert.equal(student.average, null);
  assert.equal(student.rank, null);
  await captureWeeklyStats(db, admin);
  assert.equal(
    (await db.select().from(weeklyStats).where(eq(weeklyStats.studentId, studentId))).length,
    0,
  );
  const deliveries = await processNotificationDeliveries(db, {
    sendEmail: async () => assert.fail("No scores should be emailed to inactive students"),
    sendPush: async () => assert.fail("No scores should be pushed to inactive students"),
  });
  assert.equal(deliveries.skipped, 2);
  const before = (await db.select().from(notificationDeliveries)).length;
  await writeProgress(db, studentId, admin, "award", {
    courseId: null,
    points: 5,
    kind: "followup",
    note: "Hidden follow-up",
  });
  assert.equal((await db.select().from(notificationDeliveries)).length, before);
  assert.equal((await db.select().from(awards).where(eq(awards.studentId, studentId))).length, 3);
  assert.ok(
    (await db.select().from(courses).where(eq(courses.studentId, studentId))).every(
      (course) => course.status === "active",
    ),
  );
}
