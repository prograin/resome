import { eq } from "drizzle-orm";
import {
  notifications,
  notificationDeliveries,
  pushSubscriptions,
  users,
} from "../db/schema/index.js";
import { visibleStudentEmail } from "../student-auth/student-email.js";

function insertNotifications(tx, values) {
  return tx.insert(notifications).values(values).onConflictDoNothing().returning();
}

export async function createCourseNotifications(tx, assignments, courseTitle) {
  if (!assignments.length) return [];
  return insertNotifications(
    tx,
    assignments.map(({ id, studentId }) => ({
      studentId,
      kind: "course",
      entityId: id,
      courseTitle,
    })),
  );
}

export async function createStudentNotification(tx, values) {
  const [notification] = await insertNotifications(tx, [values]);
  if (!notification || notification.kind !== "award") return notification;
  const [user] = await tx
    .select({
      email: users.email,
      verified: users.emailVerified,
      academyActive: users.academyActive,
    })
    .from(users)
    .where(eq(users.id, values.studentId));
  if (user?.academyActive === false) return notification;
  const subscriptions = await tx
    .select({ id: pushSubscriptions.id })
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.studentId, values.studentId));
  const jobs = subscriptions.map(({ id }) => ({
    notificationId: notification.id,
    channel: "push",
    target: id,
  }));
  if (user?.verified && visibleStudentEmail(user.email))
    jobs.push({ notificationId: notification.id, channel: "email", target: user.email });
  if (jobs.length) await tx.insert(notificationDeliveries).values(jobs).onConflictDoNothing();
  return notification;
}
