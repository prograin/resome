import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { users, courseDefinitions, courses, notifications } from "../../src/lib/db/schema/index.js";
import { writeAdminCourse } from "../../src/lib/db/admin-courses.js";
import { enrollmentBatchInput } from "../../src/lib/validation/admin.js";

export async function checkBatchEnrollmentData(db, fixture) {
  const { admin, studentId, otherId } = fixture;
  const [definition] = await db
    .insert(courseDefinitions)
    .values({ title: "Batch transactions" })
    .returning();
  const write = (ids) =>
    writeAdminCourse(db, admin, definition.id, "enrollMany", null, { studentIds: ids });
  const [teacher] = await db.select({ id: users.id }).from(users).where(eq(users.username, admin));
  const rows = () => db.select().from(courses).where(eq(courses.definitionId, definition.id));
  for (const ids of [[], [studentId, studentId], [studentId, "missing"], [studentId, teacher.id]]) {
    assert.equal(await write(ids), "invalid");
    assert.equal((await rows()).length, 0, "Invalid batches cannot partially enroll students");
  }
  for (const value of [
    "not-json",
    "{}",
    "[]",
    JSON.stringify([studentId, studentId]),
    JSON.stringify(Array.from({ length: 101 }, (_, n) => `user_${n}`)),
  ]) {
    assert.equal(enrollmentBatchInput.safeParse({ studentIds: value }).success, false);
  }
  assert.equal(
    enrollmentBatchInput.safeParse({ studentIds: JSON.stringify([studentId, otherId]) }).success,
    true,
  );
  const result = await Promise.all([write([studentId, otherId]), write([otherId, studentId])]);
  assert.deepEqual(result.sort(), ["duplicateEnrollment", "saved"]);
  assert.equal((await rows()).length, 2);
  const [extra] = await db
    .insert(users)
    .values({
      id: "batch_extra",
      name: "Batch extra",
      username: "batch_extra",
      email: "batch_extra@example.test",
    })
    .returning();
  assert.equal(await write([studentId, extra.id]), "saved");
  assert.equal((await rows()).length, 3);
  const events = await db
    .select()
    .from(notifications)
    .where(eq(notifications.courseTitle, definition.title));
  assert.equal(events.length, 3);
  console.log(
    "PASS batch enrollment validation, authorization targets, atomicity, concurrent replay and single notifications",
  );
}
