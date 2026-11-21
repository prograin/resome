import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { generateVAPIDKeys } from "web-push";
import { count, eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import {
  users,
  awards,
  courses,
  courseDefinitions,
  notifications,
  notificationDeliveries as jobs,
  pushSubscriptions,
} from "../src/lib/db/schema/index.js";
import { writeProgress } from "../src/lib/db/student-writes.js";
import { writeAdminCourse } from "../src/lib/db/admin-courses.js";
import { createStudentNotification } from "../src/lib/notifications/create.js";
import {
  readStudentNotifications,
  markStudentNotificationRead,
  markStudentNotificationsRead,
} from "../src/lib/db/student-notifications.js";
import { saveStudentPush, deleteStudentPush } from "../src/lib/db/student-push.js";
import { notificationHref, notificationReturnTo } from "../src/lib/notifications/targets.js";
import {
  pushSubscriptionInput,
  notificationQueryInput,
} from "../src/lib/validation/notifications.js";

const database = await createTestDatabase("student_notifications");
const { db } = database;
const size = async (table) => (await db.select({ total: count() }).from(table))[0].total;
try {
  await migrateStudentDatabase(db);
  await db.insert(users).values([
    { id: "teacher", username: "teacher", name: "Teacher", email: "teacher@example.test" },
    {
      id: "learner",
      username: "learner",
      name: "Learner",
      email: "verified@example.test",
      emailVerified: true,
    },
    { id: "other", username: "other", name: "Other", email: "unverified@example.test" },
  ]);
  const [definition] = await db
    .insert(courseDefinitions)
    .values({ title: "Notification course" })
    .returning();
  const subscription = pushSubscriptionInput.parse({
    endpoint: "https://fcm.googleapis.com/send/test",
    expirationTime: null,
    keys: { p256dh: generateVAPIDKeys().publicKey, auth: randomBytes(16).toString("base64url") },
  });
  assert.equal(await saveStudentPush(db, "learner", subscription), true);
  assert.equal(await saveStudentPush(db, "learner", subscription), true);
  assert.equal(await size(pushSubscriptions), 1);
  assert.equal(
    await saveStudentPush(db, "other", {
      ...subscription,
      keys: { ...subscription.keys, auth: randomBytes(16).toString("base64url") },
    }),
    false,
  );
  await deleteStudentPush(db, "other", subscription.endpoint);
  assert.equal(await size(pushSubscriptions), 1);
  assert.equal(
    await writeAdminCourse(db, "teacher", definition.id, "enroll", null, { studentId: "learner" }),
    "saved",
  );
  assert.equal(await size(notifications), 1);
  assert.equal(await size(jobs), 0, "course assignment must not create email or push jobs");
  const [assignment] = await db.select().from(courses);
  assert.equal(
    await writeAdminCourse(db, "teacher", definition.id, "grade", assignment.id, {
      points: 4,
      kind: "session",
      note: "Private teacher note",
    }),
    "saved",
  );
  assert.equal(await size(notifications), 2);
  assert.equal(await size(jobs), 2);
  const [award] = await db.select().from(awards);
  await db.transaction((tx) =>
    createStudentNotification(tx, {
      studentId: "learner",
      kind: "award",
      entityId: award.id,
      points: 4,
    }),
  );
  assert.equal(await size(notifications), 2);
  assert.equal(await size(jobs), 2, "replayed event must not duplicate jobs");
  assert.equal(
    await writeProgress(db, "learner", "teacher", "award", {
      courseId: null,
      points: 5,
      kind: "followup",
      note: "Follow-up",
    }),
    true,
  );
  assert.equal(await size(jobs), 4);
  assert.equal(
    await writeProgress(db, "other", "teacher", "award", {
      courseId: null,
      points: 2,
      kind: "other",
      note: "",
    }),
    true,
  );
  assert.equal(await size(jobs), 4, "unverified student must not receive email jobs");
  assert.equal(
    await writeProgress(db, "learner", "teacher", "award", {
      courseId: 999999,
      points: 2,
      kind: "session",
      note: "",
    }),
    false,
  );
  assert.equal(await size(notifications), 4, "invalid award must not create a notification");
  const beforeRollback = await size(notifications);
  await assert.rejects(
    db.transaction(async (tx) => {
      await createStudentNotification(tx, {
        studentId: "learner",
        kind: "award",
        entityId: 9999,
        points: 1,
      });
      throw new Error("Rollback grade transaction");
    }),
  );
  assert.equal(await size(notifications), beforeRollback);
  assert.equal(await size(jobs), 4);
  const inbox = await readStudentNotifications(db, "learner");
  assert.equal(inbox.items.length, 3);
  assert.equal(inbox.unread, 3);
  assert.ok(!JSON.stringify(inbox).includes("Private teacher note"));
  const [followup] = await db
    .select({ id: awards.id })
    .from(awards)
    .where(eq(awards.kind, "followup"));
  assert.equal(inbox.items[0].href, notificationHref({ kind: "award", entityId: followup.id }));
  assert.equal(await markStudentNotificationRead(db, "other", inbox.items[0].id), false);
  assert.equal(await markStudentNotificationRead(db, "learner", inbox.items[0].id), true);
  const readAt = (await readStudentNotifications(db, "learner")).items[0].readAt;
  assert.equal(await markStudentNotificationRead(db, "learner", inbox.items[0].id), true);
  assert.equal((await readStudentNotifications(db, "learner")).items[0].readAt, readAt);
  assert.equal((await readStudentNotifications(db, "learner")).unread, 2);
  await db.insert(notifications).values(
    Array.from({ length: 12 }, (_, i) => ({
      studentId: "learner",
      kind: "course",
      entityId: 10000 + i,
    })),
  );
  const seen = [];
  let cursor;
  do {
    const page = await readStudentNotifications(db, "learner", cursor);
    assert.ok(page.items.length <= 10);
    seen.push(...page.items.map((item) => item.id));
    cursor = page.nextCursor;
  } while (cursor);
  assert.equal(seen.length, 15);
  assert.equal(new Set(seen).size, 15);
  const otherUnread = (await readStudentNotifications(db, "other")).unread;
  const [later] = await db
    .insert(notifications)
    .values({ studentId: "learner", kind: "course", entityId: 99999 })
    .returning();
  assert.equal((await markStudentNotificationsRead(db, "learner", seen[0])).unread, 1);
  assert.equal((await readStudentNotifications(db, "other")).unread, otherUnread);
  const owned = await db.select().from(notifications).where(eq(notifications.studentId, "learner"));
  assert.ok(
    owned.every((item) => (item.id === later.id ? item.readAt === null : item.readAt !== null)),
  );
  assert.equal(owned.find((item) => item.id === inbox.items[0].id).readAt.toISOString(), readAt);
  for (const kind of ["award", "course"]) {
    const href = notificationHref({ kind, entityId: 42 });
    assert.equal(notificationReturnTo(href), href);
  }
  for (const bad of [
    "https://evil.test/",
    "//evil.test/",
    "/\\evil.test/",
    "/academy/students/dashboard/history/?award=42&next=https://evil.test",
    "/academy/students/dashboard/history/?award=-1",
    "/academy/students/dashboard/history/?award=42&award=43",
  ])
    assert.equal(notificationReturnTo(bad), null, bad);
  assert.equal(notificationQueryInput.safeParse({ before: "1 or 1=1" }).success, false);
  assert.equal(
    pushSubscriptionInput.safeParse({ ...subscription, endpoint: "https://127.0.0.1/private" })
      .success,
    false,
  );
  assert.equal(
    pushSubscriptionInput.safeParse({
      ...subscription,
      keys: { ...subscription.keys, auth: "invalid" },
    }).success,
    false,
  );
  console.log(
    "PASS notification events, transaction rollback, channel rules, ownership, read state, pagination, safe targets and push validation (no real sends).",
  );
} finally {
  await database.close();
}
