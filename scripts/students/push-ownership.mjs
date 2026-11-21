import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { generateVAPIDKeys } from "web-push";
import { eq } from "drizzle-orm";
import { pushSubscriptions } from "../../src/lib/db/schema/index.js";
import { saveStudentPush } from "../../src/lib/db/student-push.js";
import { createStudentNotification } from "../../src/lib/notifications/create.js";
import { processNotificationDeliveries } from "../../src/lib/notifications/delivery-worker.js";
import { installMockPush } from "./browser-push-fixture.mjs";
import { notificationCopy } from "../../src/features/notifications/copy.js";

export async function checkPushOwnership(fixture, db) {
  const subscription = {
    endpoint: "https://fcm.googleapis.com/send/retained-test",
    keys: { p256dh: generateVAPIDKeys().publicKey, auth: randomBytes(16).toString("base64url") },
  };
  await saveStudentPush(db, fixture.otherId, subscription);
  await db.transaction((tx) =>
    createStudentNotification(tx, {
      studentId: fixture.otherId,
      kind: "award",
      entityId: 99999,
      points: 3,
    }),
  );
  const state = await fixture.context.storageState();
  const context = await fixture.browser.newContext({ storageState: state });
  try {
    await installMockPush(context, subscription, { subscribed: true, permission: "granted" });
    const page = await context.newPage();
    const sync = page.waitForResponse(
      (response) =>
        response.request().method() === "POST" && response.url().includes("/api/students/push/"),
    );
    await page.goto(fixture.dashboard);
    assert.equal((await sync).status(), 200);
    await page.locator(".student-notifications__bell:visible").click();
    await page.locator(".student-notifications__push").waitFor({ state: "hidden" });
    const [row] = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, subscription.endpoint));
    assert.equal(row.studentId, fixture.studentId);
    assert.equal(
      await page.evaluate(() => window.__pushTest.requests),
      0,
      "sync must not ask permission again",
    );
    let sent = 0;
    await processNotificationDeliveries(db, {
      sendPush: async () => {
        sent++;
      },
      sendEmail: async () => {
        sent++;
      },
    });
    assert.equal(sent, 0, "old-account jobs must not follow the moved subscription");
    const stale = await context.request.post(fixture.origin + "/api/students/push/", {
      headers: { Origin: fixture.origin },
      data: { ...subscription, studentId: fixture.otherId },
    });
    assert.equal(stale.status(), 403);
  } finally {
    await context.close();
  }
  const failed = await fixture.browser.newContext({ storageState: state });
  try {
    await installMockPush(failed, subscription, { subscribed: true, permission: "granted" });
    const page = await failed.newPage();
    await page.route("**/api/students/push/**", (route) =>
      route.request().method() === "POST"
        ? route.fulfill({
            status: 503,
            contentType: "application/json",
            body: '{"error":"Unavailable"}',
          })
        : route.continue(),
    );
    await page.goto(fixture.dashboard);
    await page.locator(".student-notifications__bell:visible").click();
    await page.getByText(notificationCopy.fa.pushError, { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => window.__pushTest.subscribed), false);
    await page.getByRole("button", { name: notificationCopy.fa.enable, exact: true }).waitFor();
  } finally {
    await failed.close();
  }
  console.log(
    "PASS push ownership: retained subscription moved to current account, no permission prompt, stale-account request rejected, old jobs skipped and failed sync unsubscribed.",
  );
}
