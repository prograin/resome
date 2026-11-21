import { eq } from "drizzle-orm";
import { notifications } from "../db/schema/index.js";
import { claimDeliveries, finishDelivery } from "./delivery-claims.js";
import { deliveryBatchSize, deliveryCounts } from "./delivery-policy.js";
import { deliverAwardEmail } from "./delivery-email.js";
import { deliverBrowserPush } from "./delivery-browser.js";

async function deliver(db, job, now, sendEmail, sendPush) {
  const [notification] = await db
    .select()
    .from(notifications)
    .where(eq(notifications.id, job.notificationId));
  if (!notification || notification.kind !== "award") return { status: "skipped" };
  if (job.channel === "email") return deliverAwardEmail(db, job, notification, now, sendEmail);
  if (job.channel === "push") return deliverBrowserPush(db, job, notification, sendPush);
  return { status: "skipped" };
}

export async function processNotificationDeliveries(
  db,
  { limit = deliveryBatchSize, now = new Date(), sendEmail, sendPush } = {},
) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isFinite(now.getTime()))
    throw new TypeError("Invalid notification worker options.");
  const jobs = await claimDeliveries(db, limit, now);
  const counts = { ...deliveryCounts(), claimed: jobs.length };
  // Concurrent sends keep the entire batch within its two-minute lease.
  await Promise.all(
    jobs.map(async (job) => {
      let outcome;
      try {
        outcome = await deliver(db, job, now, sendEmail, sendPush);
      } catch {
        outcome = { status: "retry", error: "delivery_failed" };
      }
      counts[await finishDelivery(db, job, outcome, now)] += 1;
    }),
  );
  return counts;
}
