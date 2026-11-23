import { webkit, devices } from "playwright";
import { createTestDatabase } from "./lib/test-database.mjs";
import { createStudentFixture } from "./students/fixture.mjs";
import { createPreferenceContext } from "./lib/browser-preferences.mjs";
import { users } from "../src/lib/db/schema/index.js";
import { checkBatchEnrollmentData } from "./students/batch-enrollment-data.mjs";
import { checkBatchEnrollmentUI } from "./students/batch-enrollment-ui.mjs";

const database = await createTestDatabase("course_enrollment");
let fixture, safari, student;
try {
  process.env.STUDENT_TEST_DATABASE_URL = database.url;
  fixture = await createStudentFixture();
  await checkBatchEnrollmentData(database.db, fixture);
  await database.db.insert(users).values([
    {
      id: "batch_alice",
      name: "علی کریمی",
      username: "batch_alice",
      email: "batch_alice@example.test",
    },
    { id: "batch_bob", name: "سارا محمدی", username: "batch_bob", email: "batch_bob@example.test" },
  ]);
  student = await fixture.browser.newContext();
  await student.request.post(fixture.origin + "/api/auth/sign-in/username/", {
    headers: { Origin: fixture.origin },
    data: { username: fixture.username, password: fixture.password },
  });
  safari = await webkit.launch();
  for (const [browser, locale, engine, options] of [
    [fixture.browser, "fa", "edge", { viewport: { width: 1440, height: 960 } }],
    [safari, "en", "webkit", devices["iPhone 13"]],
  ]) {
    const context = await createPreferenceContext(browser, {
      ...options,
      locale,
      theme: engine === "webkit" ? "dark" : "light",
    });
    try {
      await checkBatchEnrollmentUI(fixture, database.db, context, locale, engine, student);
    } finally {
      await context.close();
    }
  }
} finally {
  await student?.close();
  await safari?.close();
  try {
    await fixture?.close();
  } finally {
    await database.close();
  }
}
