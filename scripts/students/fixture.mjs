import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { chromium } from "playwright";
import { migrateStudentDatabase } from "../../src/lib/db/migrate.js";
import { createStudentAuth } from "../../src/lib/student-auth/server.js";
import { studentPaths } from "../../src/lib/student-auth/paths.js";
import { internalStudentEmail } from "../../src/lib/student-auth/student-email.js";

import pRetry from "p-retry";
export async function createStudentFixture() {
  const scratch = process.env.STUDENT_TEST_DATABASE_URL;
  assert.ok(
    scratch && scratch !== process.env.DATABASE_URL,
    "Specify a separate scratch PostgreSQL database.",
  );
  const origin = "http://127.0.0.1:4183";
  Object.assign(process.env, {
    DATABASE_URL: scratch,
    BETTER_AUTH_URL: origin,
    BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
  });

  const username = "student_" + randomBytes(4).toString("hex");
  const admin = "admin_" + randomBytes(4).toString("hex");
  const other = "other_" + randomBytes(4).toString("hex");
  const password = randomBytes(24).toString("hex");
  process.env.STUDENT_ADMIN_USERNAME = admin;
  const { auth, pool, db } = createStudentAuth({ provision: true });
  let studentId;
  let otherId;
  try {
    await migrateStudentDatabase(db);
    await migrateStudentDatabase(db);
    const student = await auth.api.signUpEmail({
      body: { username, password, name: "Fixture Student", email: username + "@example.test" },
    });
    studentId = student.user.id;
    const second = await auth.api.signUpEmail({
      body: {
        username: other,
        password,
        name: "Fixture Other",
        email: internalStudentEmail(other),
      },
    });
    otherId = second.user.id;
    await auth.api.signUpEmail({
      body: { username: admin, password, name: "Fixture Admin", email: admin + "@example.test" },
    });
  } finally {
    await pool.end();
  }

  const server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", "4183"],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
  const closed = once(server, "exit");
  let browser;
  const close = async () => {
    if (browser) await browser.close();
    server.kill();
    await closed;
  };
  try {
    const login = origin + studentPaths.signIn;
    const dashboard = origin + studentPaths.dashboard;
    const courses = origin + studentPaths.courses;
    const profile = origin + studentPaths.profile;
    await pRetry(
      async () => {
        if (!(await fetch(login)).ok) throw new Error("Student test server is not ready.");
      },
      { retries: 30, minTimeout: 100, maxTimeout: 200 },
    );

    browser = await chromium.launch({ channel: "msedge" });
    const context = await browser.newContext({ viewport: { width: 390, height: 850 } });
    const page = await context.newPage();
    return {
      page,
      browser,
      context,
      origin,
      login,
      dashboard,
      courses,
      profile,
      username,
      admin,
      other,
      password,
      studentId,
      otherId,
      close,
    };
  } catch (error) {
    await close();
    throw error;
  }
}
