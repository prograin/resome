import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import pRetry from "p-retry";
import { notifications } from "../../src/lib/db/schema/index.js";
import { studentPaths } from "../../src/lib/student-auth/paths.js";
import { notificationCopy } from "../../src/features/notifications/copy.js";

export async function checkNotificationPage(fixture, db) {
  await db.insert(notifications).values(
    Array.from({ length: 13 }, (_, index) => ({
      studentId: fixture.studentId,
      kind: "course",
      entityId: 80000 + index,
      courseTitle: `Inbox test ${index}`,
    })),
  );
  const page = await fixture.context.newPage();
  try {
    await page.goto(fixture.origin + studentPaths.dashboard);
    const bell = page.locator(".student-notifications__bell:visible");
    await bell.click();
    const popup = page.getByRole("dialog");
    await popup.locator(".student-notifications__item").first().waitFor();
    assert.equal(await popup.locator(".student-notifications__item").count(), 5);
    await popup.getByRole("link", { name: notificationCopy.fa.all }).click();
    await page.waitForURL(fixture.origin + studentPaths.notifications);
    await page
      .locator(".student-notifications-page .student-notifications__item")
      .first()
      .waitFor();
    const inbox = page.locator(".student-notifications-page");
    await pRetry(
      async () =>
        assert.equal(
          (
            await (
              await fixture.context.request.get(fixture.origin + "/api/students/notifications/")
            ).json()
          ).unread,
          0,
        ),
      { retries: 20, minTimeout: 100, maxTimeout: 200 },
    );
    await inbox.locator('[data-unread="true"]').first().waitFor({ state: "hidden" });
    await page.locator(".student-notifications__badge:visible").waitFor({ state: "hidden" });
    assert.equal(await inbox.locator(".student-notifications__item").count(), 10);
    await inbox.getByRole("button", { name: notificationCopy.fa.more }).click();
    await inbox.locator(".student-notifications__item").nth(14).waitFor();
    assert.equal(await inbox.locator(".student-notifications__item").count(), 15);
    assert.equal(await inbox.getByRole("button", { name: notificationCopy.fa.more }).count(), 0);
    assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations, []);
    }
    await inbox.locator(".student-notifications__item").first().click();
    await page.waitForURL((url) => url.pathname === studentPaths.courses);
    assert.equal(new URL(page.url()).search, "");
    assert.equal(await page.locator("[data-notification-selected]").count(), 0);
    await page.goto(fixture.origin + studentPaths.notifications);
    await page.locator('.student-notifications-page [data-unread="false"]').first().waitFor();
  } finally {
    await page.close();
  }
  const anonymous = await fixture.browser.newContext();
  try {
    const page = await anonymous.newPage();
    await page.goto(fixture.origin + studentPaths.notifications);
    await page.waitForURL((url) => url.pathname === studentPaths.signIn);
    assert.equal(new URL(page.url()).searchParams.get("next"), studentPaths.notifications);
    await page.locator('[name="username"]').fill(fixture.username);
    await page.locator('[name="password"]').fill(fixture.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(fixture.origin + studentPaths.notifications);
  } finally {
    await anonymous.close();
  }
  console.log(
    "PASS notification page: five-item preview, pagination, read state, mobile/desktop accessibility, noindex and return after login.",
  );
}
