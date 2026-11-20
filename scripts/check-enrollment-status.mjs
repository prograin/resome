import assert from "node:assert/strict";
import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { legacyUsers, migrateBefore } from "./lib/previous-schema.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import { createDatabase } from "../src/lib/db/client.js";
import { courseDefinitions, courses, awards } from "../src/lib/db/schema/index.js";

const legacyCourses = pgTable("student_course", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  studentId: text("student_id"),
  definitionId: integer("definition_id"),
  title: text(),
  completed: boolean(),
});
const database = await createTestDatabase("enrollment_status");
try {
  await migrateBefore(database.db, 9);
  await database.db
    .insert(legacyUsers)
    .values({ id: "learner", name: "Learner", email: "learner@example.test" });
  const [definition] = await database.db
    .insert(courseDefinitions)
    .values({ title: "Course" })
    .returning();
  const old = await database.db
    .insert(legacyCourses)
    .values(
      [false, true].map((completed) => ({
        studentId: "learner",
        definitionId: definition.id,
        title: "Course",
        completed,
      })),
    )
    .returning();
  await database.db
    .insert(awards)
    .values({ studentId: "learner", courseId: old[1].id, points: 4, kind: "session" });
  await migrateStudentDatabase(database.db);
  const { db } = createDatabase(database.url, database.pool);
  const converted = await db.select().from(courses).orderBy(courses.id);
  assert.deepEqual(
    converted.map((course) => course.status),
    ["active", "completed"],
  );
  assert.deepEqual(
    converted.map((course) => course.id),
    old.map((course) => course.id),
  );
  assert.equal((await db.select().from(awards))[0].courseId, old[1].id);
  await db.update(courses).set({ status: "inactive" }).where(eq(courses.id, old[0].id));
  await migrateStudentDatabase(db);
  assert.equal(
    (await db.select().from(courses).where(eq(courses.id, old[0].id)))[0].status,
    "inactive",
  );
  await assert.rejects(
    db.update(courses).set({ status: "unknown" }),
    (error) => error.cause?.code === "23514",
  );
  console.log(
    "PASS legacy status conversion, preserved enrollments/awards, three-state database constraint and idempotent migration.",
  );
} finally {
  await database.close();
}
