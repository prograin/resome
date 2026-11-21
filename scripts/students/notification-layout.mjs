import { installMockPush } from "./browser-push-fixture.mjs";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { generateVAPIDKeys } from "web-push";
import AxeBuilder from "@axe-core/playwright";
import { count } from "drizzle-orm";
import { pushSubscriptions } from "../../src/lib/db/schema/index.js";
import { studentPaths } from "../../src/lib/student-auth/paths.js";
import { notificationCopy } from "../../src/features/notifications/copy.js";
import { checkAcademyDepth } from "../lib/academy-depth.mjs";

export async function checkNotificationLayout(fixture, db) {
  const state = await fixture.context.storageState();
  const subscription = {
    endpoint: "https://fcm.googleapis.com/send/browser-test",
    expirationTime: null,
    keys: { p256dh: generateVAPIDKeys().publicKey, auth: randomBytes(16).toString("base64url") },
  };
  for (const locale of ["fa", "en"])
    for (const theme of ["dark", "light"]) {
      const context = await fixture.browser.newContext({
        storageState: state,
        viewport: { width: 360, height: 960 },
      });
      await installMockPush(context, subscription, { locale, theme });
      try {
        const page = await context.newPage();
        await page.goto(fixture.origin + studentPaths.dashboard);
        const bell = page.locator(".student-notifications__bell:visible");
        await bell.waitFor();
        const copy = notificationCopy[locale];
        for (const width of [360, 768, 1440]) {
          await page.setViewportSize({ width, height: 960 });
          await bell.click();
          const dialog = page.getByRole("dialog", { name: copy.title, exact: true });
          await dialog.waitFor();
          await page.waitForFunction(() => {
            const element = [...document.querySelectorAll(".student-notifications")].find(
              (el) => el.getClientRects().length,
            );
            const box = element?.getBoundingClientRect();
            return box && box.x >= 0 && box.right <= innerWidth + 1;
          });
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
          const box = await dialog.boundingBox();
          assert.ok(
            box.x >= 0 && box.x + box.width <= width + 1,
            `${locale}/${theme}/${width}: ${JSON.stringify(box)}`,
          );
          await checkAcademyDepth(page);
          const accessibility = await new AxeBuilder({ page }).analyze();
          assert.deepEqual(
            accessibility.violations.map((item) => ({ id: item.id, nodes: item.nodes.length })),
            [],
          );
          await page.screenshot({
            path: `.backup/qa/notifications-${locale}-${theme}-${width}.png`,
          });
          if (locale === "fa" && theme === "dark" && width === 360) {
            assert.equal(await page.evaluate(() => window.__pushTest.requests), 0);
            await dialog.getByRole("button", { name: copy.enable, exact: true }).click();
            await dialog.locator(".student-notifications__push").waitFor({ state: "hidden" });
            assert.equal(await page.evaluate(() => window.__pushTest.requests), 1);
            assert.equal((await db.select({ total: count() }).from(pushSubscriptions))[0].total, 1);
            assert.equal(
              await dialog.getByRole("button", { name: copy.enable, exact: true }).count(),
              0,
            );
          }
          await dialog.getByRole("button", { name: copy.close, exact: true }).click();
          await dialog.waitFor({ state: "hidden" });
        }
      } finally {
        await context.close();
      }
    }
  console.log(
    "PASS notification layouts: mobile/desktop, Persian/English, light/dark, accessibility, depth and explicit push permission with mock browser subscription.",
  );
}
