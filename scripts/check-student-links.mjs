import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { legacyUsers, migrateBefore } from "./lib/previous-schema.mjs";
import { createDatabase } from "../src/lib/db/client.js";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import { users } from "../src/lib/db/schema/auth.js";
import {
  readStudentLinks,
  readStudentLinksPage,
  studentLinksPageSize,
} from "../src/lib/db/student-links.js";
import { profileLinksInput } from "../src/lib/validation/profile-links.js";
import { createStudentFixture } from "./students/fixture.mjs";
import { checkStudentLinks } from "./students/links.mjs";
import { checkInfiniteLinks } from "./students/infinite-links.mjs";

const database = await createTestDatabase("student_links");
try {
  await migrateBefore(database.db, 11);
  await database.db.insert(legacyUsers).values([
    {
      id: "student",
      name: "Private Name",
      email: "private@example.test",
      username: "learner",
      github: "Octocat",
    },
    {
      id: "admin",
      name: "Private Teacher",
      email: "teacher@example.test",
      username: "teacher",
      github: "",
    },
  ]);
  await migrateStudentDatabase(database.db);
  const { db } = createDatabase(database.url, database.pool);
  const [preserved] = await db.select().from(users).where(eq(users.id, "student"));
  assert.equal(preserved.email, "private@example.test");
  assert.equal(preserved.github, "Octocat");
  assert.equal(preserved.telegram, "");
  const links = await readStudentLinks(db, "teacher");
  assert.deepEqual(links, [
    {
      username: "learner",
      github: "https://github.com/octocat",
      telegram: "",
      linkedin: "",
      website: "",
    },
  ]);
  await db
    .update(users)
    .set({ telegram: "javascript:alert(1)", website: "https://example.test/" })
    .where(eq(users.id, "student"));
  const [safe] = await readStudentLinks(db, "teacher");
  assert.equal(safe.telegram, "");
  assert.equal(safe.website, "https://example.test/");
  await db.insert(users).values(
    Array.from({ length: 21 }, (_, index) => ({
      id: `paged-${index}`,
      name: "Private Name",
      username: `paged_${String(index).padStart(2, "0")}`,
      email: `private-${index}@example.test`,
    })),
  );
  let cursor = null;
  const seen = [];
  do {
    const page = await readStudentLinksPage(db, "teacher", cursor);
    assert.ok(page.students.length <= studentLinksPageSize);
    seen.push(...page.students.map((student) => student.username));
    cursor = page.nextCursor;
  } while (cursor);
  assert.equal(seen.length, 22);
  assert.equal(new Set(seen).size, 22);
  assert.ok(!seen.includes("teacher"));
  assert.deepEqual(await readStudentLinksPage(db, "teacher", "zzzzzz"), {
    students: [],
    nextCursor: null,
  });
  for (const [field, value] of [
    ["telegram", "https://evil.test/username"],
    ["telegram", "https://t.me/user?secret=1"],
    ["telegram", "https://user:pass@t.me/username"],
    ["telegram", "https://t.me:1234/user"],
    ["linkedin", "https://linkedin.com.evil.test/in/user"],
    ["linkedin", "https://www.linkedin.com/company/test"],
    ["website", "javascript:alert(1)"],
    ["website", "http://example.test"],
    ["website", "https://user:pass@example.test/"],
  ])
    assert.equal(profileLinksInput.safeParse({ [field]: value }).success, false, value);
  assert.deepEqual(
    profileLinksInput.parse({
      telegram: " https://t.me/learner_test ",
      linkedin: "https://www.linkedin.com/in/learner",
      website: "https://example.test",
    }),
    {
      github: "",
      telegram: "https://t.me/learner_test",
      linkedin: "https://www.linkedin.com/in/learner",
      website: "https://example.test/",
    },
  );
  console.log(
    "PASS student links migration: existing data preserved, safe link validation, private fields excluded, admin excluded and legacy GitHub names supported.",
  );
} finally {
  await database.close();
}

const browserDatabase = await createTestDatabase("student_links_browser");
let fixture;
try {
  process.env.STUDENT_TEST_DATABASE_URL = browserDatabase.url;
  fixture = await createStudentFixture();
  await checkStudentLinks(fixture, browserDatabase.db);
  await checkInfiniteLinks(fixture, browserDatabase.db);
} finally {
  try {
    await fixture?.close();
  } finally {
    await browserDatabase.close();
  }
}
