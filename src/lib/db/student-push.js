import { randomUUID } from "node:crypto";
import { and, count, eq, or } from "drizzle-orm";
import { pushSubscriptions } from "./schema/notifications.js";
import { users } from "./schema/auth.js";

export async function saveStudentPush(db, studentId, subscription) {
  return db.transaction(async (tx) => {
    await tx.select({ id: users.id }).from(users).where(eq(users.id, studentId)).for("update");
    const [existing] = await tx
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, subscription.endpoint));
    const [total] = await tx
      .select({ count: count() })
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.studentId, studentId));
    if (
      existing &&
      existing.studentId !== studentId &&
      (existing.p256dh !== subscription.keys.p256dh || existing.auth !== subscription.keys.auth)
    )
      return false;
    if (existing?.studentId !== studentId && total.count >= 10) return false;
    const saved = await tx
      .insert(pushSubscriptions)
      .values({
        id: randomUUID(),
        studentId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      })
      .onConflictDoUpdate({
        target: pushSubscriptions.endpoint,
        set: {
          studentId,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          updatedAt: new Date(),
        },
        setWhere: or(
          eq(pushSubscriptions.studentId, studentId),
          and(
            eq(pushSubscriptions.p256dh, subscription.keys.p256dh),
            eq(pushSubscriptions.auth, subscription.keys.auth),
          ),
        ),
      })
      .returning({ id: pushSubscriptions.id });
    return saved.length > 0;
  });
}

export async function deleteStudentPush(db, studentId, endpoint) {
  await db
    .delete(pushSubscriptions)
    .where(
      and(eq(pushSubscriptions.studentId, studentId), eq(pushSubscriptions.endpoint, endpoint)),
    );
}
