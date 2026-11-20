import { and, eq, isNotNull, sql } from "drizzle-orm";
import { users, weeklyStats } from "./schema/index.js";
import { studentRankings } from "./rankings.js";
import { previousStudentWeek, startOfStudentWeek } from "./weekly-calendar.js";
import { rankingPolicy } from "../scoring/policy.js";
export function readStudentLeaders(db, admin, now) {
  const ranked = studentRankings(db, admin, now).as("ranked");
  const overallRank = sql`"ranked"."overall_rank"`.mapWith(Number);
  return db
    .select({
      username: users.username,
      overallRank,
      average: ranked.average,
      previousRank: weeklyStats.overallRank,
    })
    .from(ranked)
    .innerJoin(users, eq(users.id, ranked.studentId))
    .leftJoin(
      weeklyStats,
      and(
        eq(weeklyStats.studentId, ranked.studentId),
        eq(weeklyStats.week, previousStudentWeek(startOfStudentWeek(now))),
        eq(weeklyStats.policyVersion, rankingPolicy.version),
      ),
    )
    .where(isNotNull(overallRank))
    .orderBy(overallRank, ranked.studentId)
    .limit(10);
}
