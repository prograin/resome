import assert from "node:assert/strict";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomBytes } from "node:crypto";
import { generateVAPIDKeys } from "web-push";
import { eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import {
  users,
  notifications,
  notificationDeliveries as jobs,
  pushSubscriptions,
} from "../src/lib/db/schema/index.js";
import { processNotificationDeliveries } from "../src/lib/notifications/delivery-worker.js";
import { finishDelivery } from "../src/lib/notifications/delivery-claims.js";

const scratch = await createTestDatabase("notification_delivery");
const transactionScope = new AsyncLocalStorage();
const db = new Proxy(scratch.db, {
  get(target, key) {
    if (key === "transaction")
      return (fn) => target.transaction((tx) => transactionScope.run(true, () => fn(tx)));
    const value = target[key];
    return typeof value === "function" ? value.bind(target) : value;
  },
});
const now = new Date("2026-11-21T12:00:00Z");
const later = (ms) => new Date(now.getTime() + ms);
const sends = [];
const sendEmail = async (message) => {
  assert.equal(transactionScope.getStore(), undefined, "send must run outside transaction");
  sends.push(message);
};
const sendPush = async (message) => {
  assert.equal(transactionScope.getStore(), undefined, "push must run outside transaction");
  sends.push(message);
};
const run = (options = {}) =>
  processNotificationDeliveries(db, { now, sendEmail, sendPush, ...options });
let entityId = 0;
const uniqueJobs = new Set();
async function notification(studentId = "verified", kind = "award") {
  const [row] = await db
    .insert(notifications)
    .values({
      studentId,
      kind,
      entityId: ++entityId,
      points: kind === "award" ? 4 : null,
      courseTitle: "Test <course>",
    })
    .returning();
  return row;
}
async function job(
  notificationId,
  channel = "email",
  target = "verified@example.test",
  extra = {},
) {
  const key = `${notificationId}:${channel}:${target}`;
  if (uniqueJobs.has(key)) {
    const [source] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, notificationId));
    notificationId = (await notification(source.studentId, source.kind)).id;
  }
  uniqueJobs.add(key);
  const [row] = await db
    .insert(jobs)
    .values({ notificationId, channel, target, status: "pending", nextAttemptAt: now, ...extra })
    .returning();
  return row;
}
async function read(id) {
  return (await db.select().from(jobs).where(eq(jobs.id, id)))[0];
}
async function subscription(
  id,
  studentId = "verified",
  endpoint = `https://fcm.googleapis.com/send/${id}`,
) {
  const [row] = await db
    .insert(pushSubscriptions)
    .values({
      id,
      studentId,
      endpoint,
      p256dh: generateVAPIDKeys().publicKey,
      auth: randomBytes(16).toString("base64url"),
    })
    .returning();
  return row;
}

try {
  await migrateStudentDatabase(db);
  await db.insert(users).values([
    { id: "verified", name: "Verified", email: "verified@example.test", emailVerified: true },
    { id: "unverified", name: "Unverified", email: "unverified@example.test" },
    {
      id: "internal",
      name: "Internal",
      email: "internal@students.prograin.invalid",
      emailVerified: true,
    },
  ]);
  const award = await notification();
  const course = await notification("verified", "course");
  await job(course.id);
  await job((await notification("unverified")).id, "email", "unverified@example.test");
  await job((await notification("internal")).id, "email", "internal@students.prograin.invalid");
  await job(award.id, "email", "old@example.test");
  const good = await job(award.id);
  const initial = await run();
  assert.equal(initial.sent, 1);
  assert.equal(initial.skipped, 4);
  assert.equal(sends.length, 1);
  assert.equal((await read(good.id)).status, "sent");
  assert.equal(sends[0].idempotencyKey, `academy-notification-delivery-${good.id}`);
  assert.equal((await run()).claimed, 0, "sent jobs must not replay");

  const retry = await job(award.id);
  let firstKey;
  await run({
    sendEmail: async ({ idempotencyKey }) => {
      firstKey = idempotencyKey;
      throw new Error("provider timeout with private details");
    },
  });
  assert.equal((await read(retry.id)).status, "pending");
  assert.equal((await read(retry.id)).lastError, "delivery_failed");
  assert.equal((await run()).claimed, 0);
  await run({
    now: later(60_000),
    sendEmail: async (message) => {
      assert.equal(message.idempotencyKey, firstKey);
      await sendEmail(message);
    },
  });
  assert.equal((await read(retry.id)).attempts, 2);

  const expired = await job(award.id, "email", "verified@example.test", {
    attempts: 1,
    firstAttemptAt: later(-23 * 60 * 60 * 1000),
  });
  const expiredResult = await run();
  assert.equal(expiredResult.failed, 1);
  assert.equal((await read(expired.id)).lastError, "email_retry_window_expired");

  await subscription("invalid");
  await subscription("keep");
  await job(award.id, "push", "invalid");
  const invalid = await run({
    sendPush: async () => {
      throw { statusCode: 410 };
    },
  });
  assert.equal(invalid.skipped, 1);
  assert.equal(
    (await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.id, "invalid"))).length,
    0,
  );
  assert.equal(
    (await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.id, "keep"))).length,
    1,
  );
  await subscription("wrong-owner", "unverified");
  await subscription("unsafe", "verified", "https://example.com/private");
  await job(award.id, "push", "wrong-owner");
  await job(award.id, "push", "missing");
  await job(award.id, "push", "unsafe");
  assert.equal((await run()).skipped, 3);
  await job(award.id, "push", "keep");
  const pushResult = await run({
    sendPush: async (message) => {
      assert.equal(message.payload.tag, `academy-notification-${award.id}`);
      assert.equal(message.payload.title, "Prograin Academy");
      assert.ok(message.payload.url.startsWith("/"));
      await sendPush(message);
    },
  });
  assert.equal(pushResult.sent, 1);

  const concurrent = await job(award.id);
  let concurrentSends = 0;
  const concurrentOptions = {
    sendEmail: async (message) => {
      concurrentSends += 1;
      await sendEmail(message);
    },
  };
  const results = await Promise.all([run(concurrentOptions), run(concurrentOptions)]);
  assert.equal(
    results.reduce((sum, row) => sum + row.claimed, 0),
    1,
  );
  assert.equal(concurrentSends, 1);
  assert.equal((await read(concurrent.id)).status, "sent");

  const lease = await job(award.id, "email", "verified@example.test", {
    status: "processing",
    attempts: 1,
    firstAttemptAt: now,
    lockedUntil: later(-1),
    claimToken: "old-worker",
  });
  assert.equal((await run()).sent, 1);
  assert.equal((await read(lease.id)).attempts, 2);
  assert.equal(
    await finishDelivery(db, { ...lease, claimToken: "old-worker" }, { status: "failed" }, now),
    "stale",
  );
  assert.equal((await read(lease.id)).status, "sent");
  const exhausted = await job(award.id, "email", "verified@example.test", {
    status: "processing",
    attempts: 5,
    firstAttemptAt: now,
    lockedUntil: later(-1),
    claimToken: "interrupted-worker",
  });
  assert.equal((await run()).claimed, 0);
  assert.equal((await read(exhausted.id)).status, "failed");
  const finalAttempt = await job(award.id, "email", "verified@example.test", { attempts: 4 });
  assert.equal(
    (
      await run({
        sendEmail: async () => {
          throw new Error("Unavailable");
        },
      })
    ).failed,
    1,
  );
  assert.equal((await read(finalAttempt.id)).attempts, 5);
  console.log(
    "PASS delivery eligibility, outside-transaction sends, retries, idempotency, concurrency, leases, invalid subscriptions and no duplicate sent jobs (mock transports only).",
  );
} finally {
  await scratch.close();
}
