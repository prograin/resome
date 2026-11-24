import { repeatableTransaction } from "./transaction.js";
import { weeklyRuns, weeklyStats } from "./schema/index.js";
import { studentRankings } from "./rankings.js";
import { startOfStudentWeek } from "./weekly-calendar.js";
import { rankingPolicy } from "../scoring/policy.js";
export function captureWeeklyStats(db, admin = null, now) {
  return repeatableTransaction(db, async (tx) => {
    const week = startOfStudentWeek(now);
    const policyVersion = rankingPolicy.version;
    const inserted = await tx
      .insert(weeklyRuns)
      .values({ week, policyVersion, recordedAt: now?.toISOString() })
      .onConflictDoNothing()
      .returning();
    if (!inserted.length) return { created: false };
    const ranked = await studentRankings(tx, admin, now);
    const records = ranked.map(({ overallEligible, overallAverage, ...score }) => ({
      week,
      policyVersion,
      ...score,
    }));
    for (let offset = 0; offset < records.length; offset += 500) {
      await tx.insert(weeklyStats).values(records.slice(offset, offset + 500));
    }
    return { created: true, week, students: records.length };
  });
}
