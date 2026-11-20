import assert from "node:assert/strict";
import { studentPaths } from "../../src/lib/student-auth/paths.js";

export async function checkDashboardNavigation({ page, dashboard, origin, username }) {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    await page.goto(dashboard);
    const header = page.locator(".site-header");
    const back = header
      .getByRole("button", { name: "بازگشت", exact: true })
      .filter({ visible: true });
    await back.waitFor();
    assert.equal(await back.innerText(), "");
    assert.equal(await back.locator("svg").getAttribute("data-lucide"), "arrow-left");
    assert.ok((await back.boundingBox()).x < width / 2);
    assert.equal(
      await page.locator('.academy-mobile-header a[href="' + studentPaths.profile + '"]').count(),
      0,
    );
    assert.equal(
      await page
        .locator(".student-progress__header")
        .getByRole("button", { name: "بازگشت", exact: true })
        .count(),
      0,
    );
    const toggle =
      width < 768
        ? page.locator("#academyMenuButton")
        : page.locator(".student-sidebar:visible .student-sidebar__toggle");
    await toggle.click();
    const sidebar = page.locator(".student-sidebar:visible");
    const profile = sidebar.locator(".student-sidebar__profile");
    await profile.locator("hr").waitFor();
    assert.equal(await profile.locator("bdi").innerText(), username);
    assert.equal(
      await sidebar.locator("#student-dashboard-nav a").last().getAttribute("href"),
      studentPaths.profile,
    );
    const panel = await sidebar.locator(".student-sidebar__panel").boundingBox();
    const footer = await profile.boundingBox();
    assert.ok(Math.abs(panel.y + panel.height - footer.y - footer.height) <= 12);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `.backup/qa/sidebar-profile-${width}.png` });
    await profile.getByRole("link").click();
    await page.waitForURL(origin + studentPaths.profile);
    await back.click();
    await page.waitForURL(dashboard);
  }
  await page.setViewportSize({ width: 390, height: 850 });
}
