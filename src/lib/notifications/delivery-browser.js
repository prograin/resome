import { and, eq } from "drizzle-orm";
import { pushSubscriptions } from "../db/schema/index.js";
import { pushSubscriptionInput } from "../validation/notifications.js";
import { sendDeliveryPush } from "./delivery-push.js";
import { notificationHref } from "./targets.js";

export async function deliverBrowserPush(db, job, notification, sendPush = sendDeliveryPush) {
  const [subscription] = await db
    .select()
    .from(pushSubscriptions)
    .where(
      and(
        eq(pushSubscriptions.id, job.target),
        eq(pushSubscriptions.studentId, notification.studentId),
      ),
    );
  if (!subscription) return { status: "skipped" };
  const input = {
    endpoint: subscription.endpoint,
    keys: { p256dh: subscription.p256dh, auth: subscription.auth },
  };
  if (!pushSubscriptionInput.safeParse(input).success) return { status: "skipped" };
  try {
    await sendPush({
      subscription,
      payload: {
        title: "Prograin Academy",
        body: "امتیاز جدید برای شما ثبت شد",
        url: notificationHref(notification),
        tag: `academy-notification-${notification.id}`,
      },
    });
    return { status: "sent" };
  } catch (error) {
    if (![404, 410].includes(error.statusCode)) throw error;
    // Do not remove a refreshed/replaced subscription that happened to reuse the same id.
    await db
      .delete(pushSubscriptions)
      .where(
        and(
          eq(pushSubscriptions.id, subscription.id),
          eq(pushSubscriptions.studentId, notification.studentId),
          eq(pushSubscriptions.endpoint, subscription.endpoint),
          eq(pushSubscriptions.p256dh, subscription.p256dh),
          eq(pushSubscriptions.auth, subscription.auth),
        ),
      );
    return { status: "skipped" };
  }
}
