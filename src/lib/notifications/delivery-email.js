import { and, eq } from "drizzle-orm";
import { awards, users } from "../db/schema/index.js";
import { visibleStudentEmail } from "../student-auth/student-email.js";
import { sendAwardEmail } from "../email/send-award-email.js";
import { emailRetryWindow } from "./delivery-policy.js";

export async function deliverAwardEmail(db, job, notification, now, sendEmail = sendAwardEmail) {
  const [user] = await db.select().from(users).where(eq(users.id, notification.studentId));
  if (!user?.emailVerified || !visibleStudentEmail(user.email) || user.email !== job.target)
    return { status: "skipped" };
  // Resend retains idempotency keys for 24h. Never replay an ambiguous request after 23h.
  if (now.getTime() - job.firstAttemptAt.getTime() >= emailRetryWindow)
    return { status: "failed", error: "email_retry_window_expired" };
  const [award] = await db
    .select({ note: awards.note })
    .from(awards)
    .where(and(eq(awards.id, notification.entityId), eq(awards.studentId, notification.studentId)));
  await sendEmail({
    email: user.email,
    notification,
    note: award?.note ?? "",
    idempotencyKey: `academy-notification-delivery-${job.id}`,
  });
  return { status: "sent" };
}
