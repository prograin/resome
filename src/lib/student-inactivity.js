import { and, asc, eq, inArray, lte, max, sql } from "drizzle-orm";
import { users, awards } from "./db/schema/index.js";
import { rankedStudent } from "./db/ranking-filters.js";
import { scoreTime } from "./db/score-time.js";

export const inactivityPolicy = Object.freeze({
  days: 60,
  reason: "no-score-60-days",
  batchSize: 200,
});

function inactivityDue(db, now) {
  const lastAward = db
    .select({ time: max(awards.recordedAt) })
    .from(awards)
    .where(and(eq(awards.studentId, users.id), lte(awards.recordedAt, scoreTime(now))));
  return lte(
    sql`coalesce((${lastAward}), ${users.createdAt})`,
    sql`${scoreTime(now)} - ${inactivityPolicy.days * 86400} * interval '1 second'`,
  );
}

export async function deactivateIdleStudents(db, admin, now) {
  if (!admin) throw new Error("STUDENT_ADMIN_USERNAME is required for the inactivity job.");
  let deactivated = 0;
  let cursor;
  while (true) {
    const batch = await db.transaction(async (tx) => {
      const candidates = await tx
        .select({ id: users.id })
        .from(users)
        .where(
          and(
            rankedStudent(admin),
            cursor ? sql`${users.id} > ${cursor}` : undefined,
            inactivityDue(tx, now),
          ),
        )
        .orderBy(asc(users.id))
        .limit(inactivityPolicy.batchSize)
        .for("update", { skipLocked: true });
      if (!candidates.length) return null;
      // A score writer uses the same user lock. Recheck after obtaining it.
      const changed = await tx
        .update(users)
        .set({
          academyActive: false,
          academyInactiveReason: inactivityPolicy.reason,
          academyInactiveAt: now ?? scoreTime(),
          updatedAt: now ?? scoreTime(),
        })
        .where(
          and(
            inArray(
              users.id,
              candidates.map(({ id }) => id),
            ),
            rankedStudent(admin),
            inactivityDue(tx, now),
          ),
        )
        .returning({ id: users.id });
      return { last: candidates.at(-1).id, count: changed.length };
    });
    if (!batch) break;
    deactivated += batch.count;
    cursor = batch.last;
  }
  return { deactivated };
}
