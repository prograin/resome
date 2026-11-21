import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { generateVAPIDKeys } from "web-push";
import { eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import {
  users,
  awards,
  pushSubscriptions,
  notificationDeliveries as jobs,
} from "../src/lib/db/schema/index.js";
import { createStudentNotification } from "../src/lib/notifications/create.js";
import { drainNotificationDeliveries } from "../src/lib/notifications/drain-deliveries.js";

const scratch = await createTestDatabase("notification_drain");
const { db } = scratch;
try {
  await migrateStudentDatabase(db);
  await db.insert(users).values({
    id: "learner",
    name: "Learner",
    email: "verified@example.test",
    emailVerified: true,
  });
  await db.insert(pushSubscriptions).values(
    Array.from({ length: 10 }, (_, i) => ({
      id: randomUUID(),
      studentId: "learner",
      endpoint: `https://fcm.googleapis.com/send/drain-${i}`,
      p256dh: generateVAPIDKeys().publicKey,
      auth: randomBytes(16).toString("base64url"),
    })),
  );
  async function seed(count) {
    for (let i = 0; i < count; i++)
      await db.transaction(async (tx) => {
        const [award] = await tx
          .insert(awards)
          .values({ studentId: "learner", points: 4, kind: "session" })
          .returning();
        await createStudentNotification(tx, {
          studentId: "learner",
          kind: "award",
          entityId: award.id,
          points: 4,
        });
      });
  }
  const sends = [];
  const transports = {
    sendEmail: async (message) => sends.push(message.idempotencyKey),
    sendPush: async (message) => sends.push(`${message.subscription.id}:${message.payload.tag}`),
  };
  await seed(6);
  const result = await drainNotificationDeliveries(db, transports);
  assert.equal(result.sent, 66);
  assert.equal((await db.select().from(jobs).where(eq(jobs.status, "pending"))).length, 0);
  assert.equal(new Set(sends).size, 66);
  assert.equal(sends.filter((key) => key.startsWith("academy-notification-delivery")).length, 6);
  await seed(1);
  const limited = await drainNotificationDeliveries(db, { ...transports, maxJobs: 5 });
  assert.equal(limited.claimed, 5);
  assert.equal((await drainNotificationDeliveries(db, transports)).sent, 6);
  await seed(3);
  let elapsed = 0;
  const clock = () => Date.now() + elapsed;
  const timed = await drainNotificationDeliveries(db, {
    ...transports,
    clock,
    sendEmail: async (message) => {
      elapsed = 12000;
      await transports.sendEmail(message);
    },
  });
  assert.equal(timed.claimed, 25, "reserve enough time before starting another batch");
  assert.equal((await drainNotificationDeliveries(db, transports)).sent, 8);
  await seed(1);
  const now = Date.now();
  const failed = await drainNotificationDeliveries(db, {
    ...transports,
    clock: () => now,
    sendEmail: async () => {
      throw new Error("Temporary failure");
    },
  });
  assert.equal(failed.retried, 1);
  assert.equal(failed.claimed, 11, "future retry jobs must not spin in the current run");
  assert.equal(
    (await drainNotificationDeliveries(db, { ...transports, clock: () => now + 60 * 60 * 1000 }))
      .sent,
    1,
  );
  console.log(
    "PASS queue drain: all channels across multiple batches, unique sends, job/time budgets, future retries and recovery (mock transports only).",
  );
} finally {
  await scratch.close();
}
