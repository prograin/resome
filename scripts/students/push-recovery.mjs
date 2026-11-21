import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { generateVAPIDKeys } from "web-push";
import { installMockPush } from "./browser-push-fixture.mjs";

export async function checkPushRecovery(fixture) {
  const context = await fixture.browser.newContext({
    storageState: await fixture.context.storageState(),
  });
  try {
    await installMockPush(context, {
      endpoint: "https://fcm.googleapis.com/send/recovery-test",
      keys: { p256dh: generateVAPIDKeys().publicKey, auth: randomBytes(16).toString("base64url") },
    });
    const page = await context.newPage();
    let unavailable = true;
    await page.route("**/api/students/push/**", (route) =>
      unavailable && route.request().method() === "GET"
        ? route.fulfill({ status: 503, json: { error: "Unavailable" } })
        : route.continue(),
    );
    await page.goto(fixture.dashboard);
    await page.locator(".student-notifications__bell:visible").click();
    const push = page.locator(".student-notifications__push");
    await push.getByRole("alert").waitFor();
    unavailable = false;
    await push.getByRole("button", { name: "تلاش دوباره", exact: true }).click();
    const enable = push.getByRole("button", { name: "فعال‌کردن اعلان مرورگر", exact: true });
    await enable.waitFor();
    assert.equal(await page.evaluate(() => window.__pushTest.requests), 0);
    await enable.click();
    await push.waitFor({ state: "hidden" });
    assert.equal(await page.evaluate(() => window.__pushTest.requests), 1);
    console.log(
      "PASS push configuration recovery: retry without permission prompt, explicit activation and successful subscription.",
    );
  } finally {
    await context.close();
  }
}
