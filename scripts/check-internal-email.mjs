import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { eq, sql } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import { users, accounts } from "../src/lib/db/schema/auth.js";
import { createStudentAuth } from "../src/lib/student-auth/server.js";
import { internalStudentEmail } from "../src/lib/student-auth/student-email.js";
import { changeProfileEmail } from "../src/lib/student-auth/profile-email.js";

const database = await createTestDatabase("internal_email");
Object.assign(process.env, {
  DATABASE_URL: database.url,
  BETTER_AUTH_URL: "http://127.0.0.1:4183",
  BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
});
const outbox = [];
const runtime = createStudentAuth({
  provision: true,
  database,
  sendVerificationOTP: async (data) => outbox.push(data),
});
const { db } = database;
try {
  await migrateStudentDatabase(db);
  assert.equal(internalStudentEmail("MixedCaseID"), "mixedcaseid@students.prograin.invalid");
  const password = randomBytes(24).toString("hex");
  const source = await runtime.auth.api.signUpEmail({
    body: {
      username: "source_user",
      name: "Source",
      email: "source@example.test",
      password,
    },
  });
  const [account] = await db.select().from(accounts).where(eq(accounts.userId, source.user.id));
  const id = "LegacyMixedCaseID";
  await db.insert(users).values({
    id,
    name: "Legacy user",
    username: "legacy_user",
    email: `${id}@students.prograin.invalid`,
  });
  await db.insert(accounts).values({
    id: randomUUID(),
    userId: id,
    accountId: id,
    providerId: "credential",
    password: account.password,
  });
  const response = await runtime.auth.api.signInUsername({
    body: { username: "legacy_user", password },
    asResponse: true,
  });
  assert.equal(response.status, 200);
  const headers = new Headers({
    cookie: response.headers
      .getSetCookie()
      .map((cookie) => cookie.split(";")[0])
      .join("; "),
  });
  const email = "verified@example.test";
  const run = (operation, otp) =>
    changeProfileEmail(runtime, id, headers, operation, { email, otp });
  assert.equal(await run("send"), "sent");
  assert.equal(
    await run("verify", outbox.at(-1).otp),
    "emailFailed",
    "reproduce correct OTP failing for a mixed-case legacy internal email",
  );
  const migration = await readFile(
    new URL("../drizzle/0013_normalize_internal_email.sql", import.meta.url),
    "utf8",
  );
  await db.transaction(async (tx) => {
    for (const statement of migration.split("--> statement-breakpoint"))
      await tx.execute(sql.raw(statement));
  });
  const read = async (userId) => (await db.select().from(users).where(eq(users.id, userId)))[0];
  assert.equal((await read(id)).email, internalStudentEmail(id));
  assert.equal((await read(source.user.id)).email, "source@example.test");
  await runtime.limits.emailCooldown.delete(id);
  assert.equal(await run("send"), "sent");
  assert.equal(await run("verify", outbox.at(-1).otp), "saved");
  assert.equal((await read(id)).email, email);
  assert.equal((await read(id)).emailVerified, true);
  assert.equal(await run("verify", outbox.at(-1).otp), "emailLocked");
  await assert.rejects(
    db
      .update(users)
      .set({ email: internalStudentEmail(id) })
      .where(eq(users.id, id)),
    (error) => error.cause?.constraint === "student_email_write_once",
  );
  console.log(
    "PASS legacy mixed-case internal email: reproduced valid-code failure, migration normalization, successful verification and write-once protection (no real email sent).",
  );
} finally {
  await database.close();
}
