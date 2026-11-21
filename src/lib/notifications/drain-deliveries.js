import { processNotificationDeliveries } from "./delivery-worker.js";
import {
  deliveryAttemptBudget,
  deliveryBatchSize,
  deliveryCounts,
  deliveryRunBudget,
  maxDeliveryJobs,
} from "./delivery-policy.js";

export async function drainNotificationDeliveries(
  db,
  {
    batchSize = deliveryBatchSize,
    maxJobs = maxDeliveryJobs,
    budgetMs = deliveryRunBudget,
    clock = Date.now,
    ...transports
  } = {},
) {
  if (
    !Number.isInteger(batchSize) ||
    batchSize < 1 ||
    batchSize > 100 ||
    !Number.isInteger(maxJobs) ||
    maxJobs < 1 ||
    maxJobs > 10000 ||
    !Number.isFinite(budgetMs) ||
    budgetMs < deliveryAttemptBudget
  )
    throw new TypeError("Invalid notification drain options.");
  const deadline = clock() + budgetMs;
  const totals = deliveryCounts();
  // Stop only between batches, reserving enough time for an entire send attempt.
  while (totals.claimed < maxJobs && clock() + deliveryAttemptBudget <= deadline) {
    const limit = Math.min(batchSize, maxJobs - totals.claimed);
    const batch = await processNotificationDeliveries(db, {
      ...transports,
      limit,
      now: new Date(clock()),
    });
    for (const key of Object.keys(totals)) totals[key] += batch[key];
    if (batch.claimed < limit) break;
  }
  return totals;
}
