import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import { users } from "../src/lib/db/schema/index.js";
import { internalStudentEmail } from "../src/lib/student-auth/student-email.js";
import { emailInput } from "../src/lib/validation/profile.js";

const { db, close } = await createTestDatabase("profile_email");
try {
  await migrateStudentDatabase(db);
  await db.insert(users).values([
    { id: "new", name: "New", email: internalStudentEmail("new") },
    { id: "existing", name: "Existing", email: "saved@example.test" },
  ]);
  const update = (id, email) => db.update(users).set({ email }).where(eq(users.id, id));
  const result = await Promise.allSettled([
    update("new", "first@example.test"),
    update("new", "second@example.test"),
  ]);
  assert.equal(result.filter((item) => item.status === "fulfilled").length, 1);
  assert.equal(
    result.find((item) => item.status === "rejected").reason.cause?.constraint,
    "student_email_write_once",
  );
  await assert.rejects(
    update("new", internalStudentEmail("reset")),
    (error) => error.cause?.constraint === "student_email_write_once",
  );
  await assert.rejects(
    update("existing", "replacement@example.test"),
    (error) => error.cause?.constraint === "student_email_write_once",
  );
  assert.equal(
    (await db.select().from(users).where(eq(users.id, "existing")))[0].email,
    "saved@example.test",
  );
  await db.update(users).set({ firstName: "Updated" }).where(eq(users.id, "existing"));
  assert.equal(emailInput.safeParse({ email: internalStudentEmail("fake") }).success, false);
  console.log(
    "PASS one-time email setting, concurrent update rejection, existing-email protection, placeholder reset rejection and independent profile updates.",
  );
} finally {
  await close();
}
