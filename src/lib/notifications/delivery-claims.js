import { randomUUID } from "node:crypto";
import { and, eq, lt, lte, or, sql } from "drizzle-orm";
import { notificationDeliveries as jobs } from "../db/schema/index.js";
import { maxAttempts, emailRetryWindow } from "./delivery-policy.js";

export async function claimDeliveries(db, limit, now) {
  return db.transaction(async (tx) => {
    const due = or(
      and(eq(jobs.status, "pending"), lte(jobs.nextAttemptAt, now)),
      and(eq(jobs.status, "processing"), lte(jobs.lockedUntil, now)),
    );
    // An interrupted final attempt must not leave a permanently processing job.
    await tx
      .update(jobs)
      .set({
        status: "failed",
        claimToken: null,
        lockedUntil: null,
        lastError: "attempts_exhausted",
      })
      .where(and(due, sql`${jobs.attempts} >= ${maxAttempts}`));
    const selected = await tx
      .select()
      .from(jobs)
      .where(and(due, lt(jobs.attempts, maxAttempts)))
      .orderBy(jobs.nextAttemptAt, jobs.id)
      .limit(limit)
      .for("update", { skipLocked: true });
    const claimed = [];
    for (const job of selected) {
      const [updated] = await tx
        .update(jobs)
        .set({
          status: "processing",
          claimToken: randomUUID(),
          attempts: job.attempts + 1,
          firstAttemptAt: job.firstAttemptAt ?? now,
          lockedUntil: new Date(now.getTime() + 120_000),
        })
        .where(eq(jobs.id, job.id))
        .returning();
      claimed.push(updated);
    }
    return claimed;
  });
}

export async function finishDelivery(db, job, outcome, now) {
  const delay = 60_000 * 2 ** (job.attempts - 1);
  const retryAt = new Date(now.getTime() + delay);
  const expired =
    job.channel === "email" && retryAt.getTime() - job.firstAttemptAt.getTime() >= emailRetryWindow;
  const retry = outcome.status === "retry" && job.attempts < maxAttempts && !expired;
  const status = outcome.status === "retry" ? (retry ? "pending" : "failed") : outcome.status;
  const updated = await db
    .update(jobs)
    .set({
      status,
      claimToken: null,
      lockedUntil: null,
      lastError: outcome.error ?? null,
      ...(retry ? { nextAttemptAt: retryAt } : {}),
      ...(status === "sent" ? { sentAt: now } : {}),
    })
    .where(
      and(eq(jobs.id, job.id), eq(jobs.claimToken, job.claimToken), eq(jobs.status, "processing")),
    )
    .returning({ id: jobs.id });
  return updated.length ? (retry ? "retried" : status) : "stale";
}
