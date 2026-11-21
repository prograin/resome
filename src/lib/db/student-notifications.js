import { and, count, desc, eq, isNull, lt, lte } from "drizzle-orm";
import { notifications } from "./schema/notifications.js";
import { notificationHref } from "../notifications/targets.js";

export async function readStudentNotifications(db, studentId, before) {
  const owner = eq(notifications.studentId, studentId);
  const [rows, [total]] = await Promise.all([
    db
      .select()
      .from(notifications)
      .where(and(owner, before ? lt(notifications.id, before) : undefined))
      .orderBy(desc(notifications.id))
      .limit(11),
    db
      .select({ unread: count() })
      .from(notifications)
      .where(and(owner, isNull(notifications.readAt))),
  ]);
  const items = rows.slice(0, 10).map((row) => ({
    id: row.id,
    kind: row.kind,
    points: row.points,
    courseTitle: row.courseTitle,
    createdAt: row.createdAt.toISOString(),
    readAt: row.readAt?.toISOString() ?? null,
    href: notificationHref(row),
  }));
  return { items, nextCursor: rows.length > 10 ? items.at(-1).id : null, unread: total.unread };
}

export async function markStudentNotificationRead(db, studentId, id) {
  const owned = and(eq(notifications.id, id), eq(notifications.studentId, studentId));
  const [existing] = await db.select({ id: notifications.id }).from(notifications).where(owned);
  if (!existing) return false;
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(owned, isNull(notifications.readAt)));
  return true;
}

export async function markStudentNotificationsRead(db, studentId, through) {
  const readAt = new Date();
  const owner = eq(notifications.studentId, studentId);
  await db
    .update(notifications)
    .set({ readAt })
    .where(and(owner, lte(notifications.id, through), isNull(notifications.readAt)));
  const [total] = await db
    .select({ unread: count() })
    .from(notifications)
    .where(and(owner, isNull(notifications.readAt)));
  return { ok: true, unread: total.unread, readAt: readAt.toISOString() };
}
