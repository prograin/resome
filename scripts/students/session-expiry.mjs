import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { eq } from "drizzle-orm";
import { createDatabase } from "../../src/lib/db/client.js";
import { sessions } from "../../src/lib/db/schema/auth.js";
import { studentAuthPolicy } from "../../src/lib/student-auth/config.js";

export async function checkSessionExpiry({ page, login, dashboard, origin, password, submit }) {
  await delay(10_100);
  await page.clock.install();
  await page.goto(login);
  await submit(password);
  await page.waitForURL(dashboard);
  await page.locator(".student-dashboard__main").waitFor();
  await page.waitForLoadState("networkidle");
  const session = await (await page.request.get(origin + "/api/auth/get-session/")).json();
  const { db, pool } = createDatabase(process.env.STUDENT_TEST_DATABASE_URL);
  try {
    await db
      .update(sessions)
      .set({ expiresAt: new Date(0) })
      .where(eq(sessions.id, session.session.id));
  } finally {
    await pool.end();
  }
  await page.clock.fastForward(studentAuthPolicy.sessionRefreshInterval * 1000 + 100);
  await page.waitForURL(login);
  assert.equal(await page.locator(".student-dashboard__main").count(), 0);
  assert.equal(await (await page.request.get(origin + "/api/auth/get-session/")).json(), null);
}
