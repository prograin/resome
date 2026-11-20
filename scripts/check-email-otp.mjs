import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import { createStudentAuth } from "../src/lib/student-auth/server.js";
import { changeProfileEmail } from "../src/lib/student-auth/profile-email.js";
import { internalStudentEmail } from "../src/lib/student-auth/student-email.js";
import { users, verifications } from "../src/lib/db/schema/auth.js";
import { mutationLimits } from "../src/lib/db/schema/security.js";
import { emailVerificationInput } from "../src/lib/validation/profile.js";

const cachedDelivery = await import("../src/lib/email/delivery-status.js?cached-auth");
const reloadedDelivery = await import("../src/lib/email/delivery-status.js?reloaded-action");
assert.equal(
  await reloadedDelivery.confirmEmailDelivery(async () => cachedDelivery.markEmailDelivered()),
  true,
  "a cached auth callback must report success to a refreshed server action",
);
assert.deepEqual(
  await Promise.all([
    reloadedDelivery.confirmEmailDelivery(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      cachedDelivery.markEmailDelivered();
    }),
    cachedDelivery.confirmEmailDelivery(async () => {}),
  ]),
  [true, false],
  "concurrent delivery results must remain isolated",
);

const database = await createTestDatabase("email_otp");
Object.assign(process.env, {
  DATABASE_URL: database.url,
  BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
  BETTER_AUTH_URL: "http://127.0.0.1:4183",
});
const outbox = [];
const runtime = createStudentAuth({
  provision: true,
  database,
  sendVerificationOTP: async (message) => outbox.push(message),
});
try {
  await migrateStudentDatabase(database.db);
  const password = randomBytes(24).toString("hex");
  const learner = async (username) => {
    const { user } = await runtime.auth.api.signUpEmail({
      body: { username, password, name: username, email: internalStudentEmail(username) },
    });
    const response = await runtime.auth.api.signInUsername({
      body: { username, password },
      asResponse: true,
    });
    assert.equal(response.status, 200);
    const headers = new Headers({
      cookie: response.headers
        .getSetCookie()
        .map((cookie) => cookie.split(";")[0])
        .join("; "),
    });
    return { user, headers };
  };
  const first = await learner("otp_first");
  const second = await learner("otp_second");
  const run = (learner, operation, email, otp) =>
    changeProfileEmail(runtime, learner.user.id, learner.headers, operation, { email, otp });
  const read = async (learner) =>
    (await database.db.select().from(users).where(eq(users.id, learner.user.id)))[0];
  const email = "verified@example.test";
  assert.equal(await run(first, "send", email), "sent");
  const code = outbox.at(-1).otp;
  assert.match(code, /^\d{4}$/);
  assert.equal((await read(first)).email, first.user.email);
  assert.equal((await read(first)).emailVerified, false);
  const [stored] = await database.db.select().from(verifications);
  assert.notEqual(stored.value.split(":")[0], code);
  assert.equal(await run(first, "send", email), "emailLimit");
  const cooldown = await runtime.limits.emailCooldown.get(first.user.id);
  assert.ok(cooldown.msBeforeNext > 110_000 && cooldown.msBeforeNext <= 120_000);
  await database.db
    .update(mutationLimits)
    .set({ expire: new Date(Date.now() + 50_000) })
    .where(eq(mutationLimits.key, runtime.limits.emailCooldown.getKey(first.user.id)));
  assert.equal(
    await run(first, "send", email),
    "emailLimit",
    "sending remains blocked after the first minute",
  );
  assert.equal(await run(second, "verify", email, code), "invalidCode");
  assert.equal(await run(first, "verify", "different@example.test", code), "invalidCode");
  const wrong = code === "0000" ? "9999" : "0000";
  assert.equal(await run(first, "verify", email, wrong), "invalidCode");
  assert.equal(await run(first, "verify", email, code), "saved");
  assert.equal((await read(first)).email, email);
  assert.equal((await read(first)).emailVerified, true);
  assert.equal(await run(first, "verify", email, code), "emailLocked");
  assert.equal(await run(first, "send", "replacement@example.test"), "emailLocked");
  await assert.rejects(
    runtime.auth.api.changeEmail({
      headers: second.headers,
      body: { newEmail: "bypass@example.test" },
    }),
  );
  assert.equal(await run(second, "send", "expired@example.test"), "sent");
  const expired = outbox.at(-1).otp;
  await database.db.update(verifications).set({ expiresAt: new Date(Date.now() - 1000) });
  assert.equal(await run(second, "verify", "expired@example.test", expired), "expiredCode");
  await runtime.limits.emailCooldown.delete(second.user.id);
  assert.equal(await run(second, "send", "attempts@example.test"), "sent");
  const attemptCode = outbox.at(-1).otp;
  for (let index = 0; index < 3; index++)
    assert.equal(
      await run(
        second,
        "verify",
        "attempts@example.test",
        attemptCode === "0000" ? "9999" : "0000",
      ),
      "invalidCode",
    );
  assert.equal(await run(second, "verify", "attempts@example.test", attemptCode), "codeAttempts");
  assert.equal((await read(second)).email, second.user.email);
  await runtime.limits.emailCooldown.delete(second.user.id);
  assert.equal(await run(second, "send", "resent@example.test"), "sent");
  await runtime.limits.emailCooldown.delete(second.user.id);
  const messageCount = outbox.length;
  assert.equal(await run(second, "send", "over-limit@example.test"), "emailLimit");
  assert.equal(outbox.length, messageCount);
  const third = await learner("otp_third");
  assert.equal(await run(third, "send", email), "emailUnavailable");
  await runtime.limits.emailCooldown.delete(third.user.id);
  const unavailable = createStudentAuth({
    database,
    sendVerificationOTP: async () => {
      throw new Error("Simulated delivery failure");
    },
  });
  assert.equal(
    await changeProfileEmail(unavailable, third.user.id, third.headers, "send", {
      email: "outage@example.test",
    }),
    "emailFailed",
  );
  assert.equal((await read(third)).email, third.user.email);
  for (const otp of ["۱۲۳۴", "١٢٣٤", "1234"])
    assert.equal(emailVerificationInput.parse({ email, otp }).otp, "1234");
  assert.equal(emailVerificationInput.safeParse({ email, otp: "12345" }).success, false);
  console.log(
    "PASS OTP: hashed four digits, delayed saving, verification, expiry, replay/identity/email binding, attempt limits, cooldown, bypass rejection and Persian/Arabic digits.",
  );
} finally {
  await database.close();
}
