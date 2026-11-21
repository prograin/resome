import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, readFile, rm, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { migrateStudentDatabase } from "../../src/lib/db/migrate.js";
import { createStudentAuth } from "../../src/lib/student-auth/server.js";
import { studentPaths } from "../../src/lib/student-auth/paths.js";
import { internalStudentEmail } from "../../src/lib/student-auth/student-email.js";

import pRetry from "p-retry";
import { academyApp } from "../../src/features/academy-app/paths.js";
export async function createStudentFixture({ showInstallInvitation = false } = {}) {
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

  const emailDirectory = await mkdtemp(join(tmpdir(), "prograin-email-test-"));
  const emailOutbox = join(emailDirectory, "outbox.jsonl");
  const readEmailMessages = async () => {
    try {
      return (await readFile(emailOutbox, "utf8"))
        .trim()
        .split("\n")
        .filter(Boolean)
        .map(JSON.parse);
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  };
  const server = spawn(
    process.execPath,
    [
      "--import",
      "./scripts/students/email-outbox.mjs",
      "node_modules/next/dist/bin/next",
      "start",
      "-H",
      "127.0.0.1",
      "-p",
      "4183",
    ],
    {
      stdio: ["ignore", "ignore", "inherit"],
      env: {
        ...process.env,
        STUDENT_TEST_EMAIL_OUTBOX: emailOutbox,
        RESEND_API_KEY: "re_test_fixture",
        RESEND_FROM_EMAIL: "Prograin <noreply@example.test>",
      },
    },
  );
  const closed = once(server, "exit");
  let browser;
  const close = async () => {
    if (browser) await browser.close();
    server.kill();
    await closed;
    await rm(emailOutbox, { force: true });
    await rmdir(emailDirectory);
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
    if (!showInstallInvitation)
      await context.addInitScript(
        (key) => sessionStorage.setItem(key, "1"),
        academyApp.invitationKey,
      );
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
      readEmailMessages,
      async readEmailCode(email) {
        const messages = await readEmailMessages();
        return messages.findLast((message) => message.to.includes(email))?.otp;
      },
      close,
    };
  } catch (error) {
    await close();
    throw error;
  }
}
