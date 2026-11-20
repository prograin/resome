import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { repeatableTransaction } from "./db/transaction.js";
import { weeklyRuns, weeklyStats } from "./db/schema/index.js";
import { previousStudentWeek } from "./db/weekly-calendar.js";
import { readStudentLeaders } from "./db/student-leaders.js";
import { rankingPolicy } from "./scoring/policy.js";
export { captureWeeklyStats } from "./db/capture-weekly.js";
export function readWeeklyStats(db, studentId, admin = null, now) {
  return repeatableTransaction(
    db,
    async (tx) => {
      const leaders = await readStudentLeaders(tx, admin, now);
      const [run] = await tx
        .select()
        .from(weeklyRuns)
        .where(eq(weeklyRuns.policyVersion, rankingPolicy.version))
        .orderBy(desc(weeklyRuns.week))
        .limit(1);
      if (!run) return { stats: null, leaders };
      const previous = alias(weeklyStats, "previous");
      const [stats] = await tx
        .select({
          ...getTableColumns(weeklyStats),
          recordedAt: weeklyRuns.recordedAt,
          previousAverage: previous.average,
          previousAssessments: previous.assessments,
          previousRank: previous.overallRank,
          previousCourseRank: previous.courseRank,
          previousCourseId: previous.courseId,
        })
        .from(weeklyStats)
        .innerJoin(
          weeklyRuns,
          and(
            eq(weeklyRuns.week, weeklyStats.week),
            eq(weeklyRuns.policyVersion, weeklyStats.policyVersion),
          ),
        )
        .leftJoin(
          previous,
          and(
            eq(previous.studentId, weeklyStats.studentId),
            eq(previous.week, previousStudentWeek(run.week)),
            eq(previous.policyVersion, rankingPolicy.version),
          ),
        )
        .where(
          and(
            eq(weeklyStats.week, run.week),
            eq(weeklyStats.policyVersion, rankingPolicy.version),
            eq(weeklyStats.studentId, studentId),
          ),
        );
      return { stats: stats ?? null, leaders };
    },
    { accessMode: "read only" },
  );
}
