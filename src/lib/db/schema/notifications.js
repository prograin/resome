import { sql } from "drizzle-orm";
import { check, index, integer, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./auth.js";

const date = (name) => timestamp(name, { withTimezone: true });
const student = () =>
  text("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" });

export const notifications = pgTable(
  "student_notification",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    studentId: student(),
    kind: text({ enum: ["award", "course"] }).notNull(),
    entityId: integer("entity_id").notNull(),
    points: integer(),
    courseTitle: text("course_title"),
    createdAt: date("created_at").notNull().defaultNow(),
    readAt: date("read_at"),
  },
  (t) => [
    unique().on(t.studentId, t.kind, t.entityId),
    index("student_notification_recipient_idx").on(t.studentId, t.id.desc()),
    check("student_notification_kind_check", sql`${t.kind} in ('award', 'course')`),
    check("student_notification_points_check", sql`${t.points} between 1 and 5`),
  ],
);

export const pushSubscriptions = pgTable(
  "student_push_subscription",
  {
    id: text().primaryKey(),
    studentId: student(),
    endpoint: text().notNull().unique(),
    p256dh: text().notNull(),
    auth: text().notNull(),
    createdAt: date("created_at").notNull().defaultNow(),
    updatedAt: date("updated_at").notNull().defaultNow(),
  },
  (t) => [index("student_push_subscription_recipient_idx").on(t.studentId)],
);

export const notificationDeliveries = pgTable(
  "student_notification_delivery",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    notificationId: integer("notification_id")
      .notNull()
      .references(() => notifications.id, { onDelete: "cascade" }),
    channel: text({ enum: ["email", "push"] }).notNull(),
    target: text().notNull(),
    status: text({ enum: ["pending", "processing", "sent", "skipped", "failed"] })
      .notNull()
      .default("pending"),
    attempts: integer().notNull().default(0),
    nextAttemptAt: date("next_attempt_at").notNull().defaultNow(),
    lockedUntil: date("locked_until"),
    claimToken: text("claim_token"),
    firstAttemptAt: date("first_attempt_at"),
    sentAt: date("sent_at"),
    lastError: text("last_error"),
  },
  (t) => [
    unique().on(t.notificationId, t.channel, t.target),
    index("student_notification_delivery_due_idx").on(t.status, t.nextAttemptAt),
    check("student_notification_delivery_channel_check", sql`${t.channel} in ('email', 'push')`),
    check(
      "student_notification_delivery_status_check",
      sql`${t.status} in ('pending', 'processing', 'sent', 'skipped', 'failed')`,
    ),
  ],
);
