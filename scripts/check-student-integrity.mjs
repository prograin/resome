import assert from "node:assert/strict";
import { and, eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { createStudentFixture } from "./students/fixture.mjs";
import { checkProfileIdentityRace } from "./students/profile-identity-race.mjs";
import { users, courses, courseDefinitions, notifications } from "../src/lib/db/schema/index.js";
import { writeProgress } from "../src/lib/db/student-writes.js";
import { writeAdminCourse } from "../src/lib/db/admin-courses.js";
import { readManagedStudent } from "../src/lib/db/managed-student.js";
import { studentRankings } from "../src/lib/db/rankings.js";

const database = await createTestDatabase("student_integrity");
let fixture;
try {
  process.env.STUDENT_TEST_DATABASE_URL = database.url;
  fixture = await createStudentFixture();
  const { db } = database;
  const { admin, studentId, otherId, origin, page, password } = fixture;
  const [definition] = await db
    .insert(courseDefinitions)
    .values({ title: "Unique course" })
    .returning();
  const values = { definitionId: definition.id, course: { title: definition.title } };
  const enroll = (id) => writeProgress(db, id, admin, "course", values);
  assert.equal(await enroll(studentId), true);
  assert.equal(await enroll(studentId), false);
  await writeProgress(db, studentId, admin, "award", {
    courseId: null,
    points: 5,
    kind: "other",
    note: "",
  });
  const scores = await studentRankings(db, admin);
  assert.equal(scores.find((score) => score.studentId === studentId).overallEligible, false);
  const parallel = await Promise.all([
    enroll(otherId),
    writeAdminCourse(db, admin, definition.id, "enroll", null, { studentId: otherId }),
    enroll(otherId),
  ]);
  assert.equal(parallel.filter((result) => result === true || result === "saved").length, 1);
  assert.equal((await db.select().from(courses)).length, 2);
  assert.equal(
    (await db.select().from(notifications).where(eq(notifications.kind, "course"))).length,
    2,
  );
  await db.update(courses).set({ status: "completed" }).where(eq(courses.studentId, studentId));
  assert.equal(await enroll(studentId), false);
  assert.equal(
    await writeAdminCourse(db, admin, definition.id, "enroll", null, { studentId }),
    "duplicateEnrollment",
  );
  const [next] = await db.insert(courseDefinitions).values({ title: "Next course" }).returning();
  assert.equal(
    await writeProgress(db, studentId, admin, "course", { ...values, definitionId: next.id }),
    true,
  );
  assert.equal(
    (
      await db
        .select()
        .from(courses)
        .where(and(eq(courses.studentId, studentId), eq(courses.definitionId, definition.id)))
    ).length,
    1,
  );
  console.log(
    "PASS enrollment uniqueness across both writers, concurrent requests and completed courses",
  );

  assert.equal((await readManagedStudent(db, studentId, admin)).id, studentId);
  const [adminUser] = await db.select().from(users).where(eq(users.username, admin));
  for (const id of [adminUser.id, "missing", [studentId], "invalid/id"]) {
    assert.equal(await readManagedStudent(db, id, admin), null);
  }
  await page.request.post(origin + "/api/auth/sign-in/username/", {
    headers: { Origin: origin },
    data: { username: admin, password },
  });
  const url = origin + "/academy/students/dashboard/?student=" + studentId;
  const before = await (await page.request.get(url)).text();
  await db.insert(users).values(
    Array.from({ length: 1000 }, (_, index) => ({
      id: "payload_" + index,
      username: "payload_" + index,
      name: "Unrelated Student " + index,
      email: `payload_${index}@example.test`,
    })),
  );
  const after = await (await page.request.get(url)).text();
  assert.ok(!after.includes("payload_999"));
  assert.ok(Math.abs(Buffer.byteLength(after) - Buffer.byteLength(before)) < 4096);
  console.log(
    "PASS selected student lookup, invalid IDs and bounded response with 1000 extra users",
  );
  await page.request.post(origin + "/api/auth/sign-out/", {
    headers: { Origin: origin },
    data: {},
  });
  await checkProfileIdentityRace(fixture, database);
} finally {
  try {
    await fixture?.close();
  } finally {
    await database.close();
  }
}
