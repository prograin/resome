export const deliveryBatchSize = 25;
export const deliveryRunBudget = 45_000;
export const deliveryAttemptBudget = 35_000;
export const maxDeliveryJobs = 500;
export const maxAttempts = 5;
export const emailRetryWindow = 23 * 60 * 60 * 1000;

export const deliveryCounts = () => ({
  claimed: 0,
  sent: 0,
  skipped: 0,
  failed: 0,
  retried: 0,
  stale: 0,
});
