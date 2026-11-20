import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import { mutationLimits } from "../src/lib/db/schema/security.js";
import { users, sessions, verifications } from "../src/lib/db/schema/auth.js";
import {
  createMutationLimits,
  consumeMutationLimit,
  consumeRateLimit,
} from "../src/lib/security/mutation-limit.js";
import { clearExpiredSecurityRecords } from "../src/lib/security/cleanup.js";

const { db, close } = await createTestDatabase("security");
try {
  await migrateStudentDatabase(db);
  const first = createMutationLimits(db);
  const second = createMutationLimits(db);
  const requests = await Promise.all(
    Array.from({ length: 50 }, (_, index) =>
      consumeMutationLimit(index % 2 ? first : second, "parallel-student"),
    ),
  );
  assert.equal(requests.filter((result) => result === null).length, 40);
  assert.equal(requests.filter((result) => result === "limit").length, 10);
  assert.equal(await consumeMutationLimit(first, "other-student"), null);
  for (let index = 0; index < 8; index++) {
    assert.equal(await consumeMutationLimit(first, "profile-student", "profile"), null);
  }
  assert.equal(await consumeMutationLimit(second, "profile-student", "profile"), "limit");
  const login = await Promise.all(
    Array.from({ length: 25 }, () => consumeRateLimit(first.login, "hashed-login")),
  );
  assert.equal(login.filter((result) => !result.status).length, 20);
  assert.ok(login.filter((result) => result.status).every((result) => result.retryAfter > 0));
  await db
    .update(mutationLimits)
    .set({ expire: new Date(Date.now() - 1000) })
    .where(eq(mutationLimits.key, "profile:profile-student"));
  assert.equal(await consumeMutationLimit(second, "profile-student", "profile"), null);
  await db.insert(mutationLimits).values({ key: "expired", expire: new Date(0) });
  await db
    .insert(users)
    .values({ id: "cleanup", name: "Fixture", username: "cleanup", email: "cleanup@example.test" });
  const expires = [new Date(0), new Date(Date.now() + 86_400_000)];
  await db.insert(sessions).values(
    expires.map((expiresAt, index) => ({
      id: `session-${index}`,
      token: `token-${index}`,
      userId: "cleanup",
      expiresAt,
    })),
  );
  await db.insert(verifications).values(
    expires.map((expiresAt, index) => ({
      id: `verification-${index}`,
      identifier: `fixture-${index}`,
      value: "fixture",
      expiresAt,
    })),
  );
  await clearExpiredSecurityRecords(db);
  assert.deepEqual(
    (await db.select({ id: sessions.id }).from(sessions)).map((row) => row.id),
    ["session-1"],
  );
  assert.deepEqual(
    (await db.select({ id: verifications.id }).from(verifications)).map((row) => row.id),
    ["verification-1"],
  );
  assert.equal(
    (await db.select().from(mutationLimits).where(eq(mutationLimits.key, "expired"))).length,
    0,
  );
  assert.equal(
    await consumeMutationLimit(
      {
        write: {
          consume: async () => {
            throw new Error("Store down");
          },
        },
      },
      "user",
    ),
    "failed",
  );
  console.log(
    "PASS security database: atomic shared limits, expiry, isolation, profile quota and fail-closed writes.",
  );
} finally {
  await close();
}
