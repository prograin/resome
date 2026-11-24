import { and, desc, eq, sql } from "drizzle-orm";
import { courses, users, weeklyStats } from "./schema/index.js";
import { courseRankings } from "./course-rankings.js";
import { previousStudentWeek, startOfStudentWeek } from "./weekly-calendar.js";
import { rankingPolicy } from "../scoring/policy.js";

export async function readCurrentCourseLeaders(db, studentId, admin, now) {
  const [current] = await db
    .select({ definitionId: courses.definitionId })
    .from(courses)
    .where(eq(courses.studentId, studentId))
    .orderBy(desc(courses.id))
    .limit(1);
  if (!current?.definitionId) return [];
  const { totals, ranks } = courseRankings(db, admin, now);
  const rank = sql`"course_ranks"."course_rank"`.mapWith(Number);
  return db
    .with(totals, ranks)
    .select({
      username: users.username,
      overallRank: rank,
      average: totals.average,
      previousRank: weeklyStats.courseRank,
    })
    .from(totals)
    .innerJoin(ranks, eq(ranks.courseId, totals.courseId))
    .innerJoin(users, eq(users.id, totals.studentId))
    .leftJoin(
      weeklyStats,
      and(
        eq(weeklyStats.studentId, totals.studentId),
        eq(weeklyStats.courseId, totals.courseId),
        eq(weeklyStats.week, previousStudentWeek(startOfStudentWeek(now))),
        eq(weeklyStats.policyVersion, rankingPolicy.version),
      ),
    )
    .where(eq(totals.definitionId, current.definitionId))
    .orderBy(rank, totals.studentId)
    .limit(10);
}
