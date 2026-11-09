// Browser regression checks. Install the optional runner: npm install --no-save playwright
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const origin = process.env.SITE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ channel: "msedge", headless: true });
await mkdir(new URL("../.backup/qa/", import.meta.url), { recursive: true });

try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext({
      viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
      isMobile: mobile,
      hasTouch: mobile,
    });
    const page = await context.newPage();
    const errors = [];
    const requests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    page.on("request", (request) => requests.push(request.url()));
    const label = mobile ? "mobile" : "desktop";

    for (const route of ["/", "/contact/", "/academy/", "/order/", "/resume/"]) {
      requests.length = 0;
      await page.goto(`${origin}${route}`);
      await page.waitForLoadState("networkidle");
      assert.equal(await page.locator("[data-page]:not(.hidden)").count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true,
        `Horizontal overflow: ${label} ${route}`);
      assert.equal(await page.evaluate(() => document.fonts.check('16px "Vazirmatn"')), true);
      assert.equal(requests.some((url) => /googleapis|gstatic|-bg\.jpg/.test(url)), false);

      if (route === "/") {
        assert.equal(await page.locator("[data-rendered-locale]").count(), 2);
        assert.equal(await page.locator("#projectsGrid > *").count(), 0);
        assert.equal(requests.filter((url) => /optimized\//.test(url)).length, 1);
        assert.ok(requests.some((url) => url.includes(`home-bg-${mobile ? 960 : 1920}.webp`)));
      }
      if (route === "/contact/") {
        assert.ok(requests.some((url) => url.includes(`contact-bg-${mobile ? 960 : 1920}.webp`)));
      }
      if (route === "/academy/") {
        assert.equal(requests.some((url) => url.includes("academy-youtube-bg")), false);
        await page.locator(".academy-youtube-section").scrollIntoViewIfNeeded();
        await page.waitForLoadState("networkidle");
        await page.waitForFunction(() => document.querySelector(".academy-youtube-section").classList.contains("is-bg-ready"));
        if (mobile) {
          await page.locator("[data-academy-tab='group']").click();
          assert.equal(await page.locator("[data-academy-tab='group']").getAttribute("aria-selected"), "true");
        } else {
          assert.equal(await page.locator("[data-academy-plan]:visible").count(), 2);
        }
      }
      if (route === "/order/") {
        assert.equal(await page.locator(".order-clients").count(), 0);
        assert.equal(await page.locator(".project-showcase__item").count(), 4);
        await page.locator(".project-showcase").scrollIntoViewIfNeeded();
        await page.waitForFunction(() => [...document.querySelectorAll(".project-showcase__logo img")].every((image) => image.complete && image.naturalWidth > 0));
        assert.equal(await page.locator('.project-showcase__item[href="https://drbajelani.ir/"]').count(), 1);
        assert.equal(await page.locator('.project-showcase__item[href="https://parkping.site/"]').count(), 1);
        assert.ok(await page.locator("[data-lucide='chevron-left']").count());
        await page.locator("#langToggle").click();
        assert.equal(await page.locator("html").getAttribute("dir"), "ltr");
        assert.ok(await page.locator("[data-lucide='chevron-right']").count());
        await page.locator("#langToggle").click();
      }
      if (route === "/resume/") {
        assert.match(await page.locator("meta[name='robots']").getAttribute("content"), /noindex/);
        assert.ok(await page.locator("#projectsGrid > *").count());
        assert.equal(await page.locator("#siteFooter").isVisible(), false);
      }
      console.log(`PASS ${label} ${route}`);
    }

    // Exercise navigation without reloading, cached markup and language changes.
    await page.evaluate(() => document.querySelector("[data-page-link='home']").click());
    await page.locator("#homePage:not(.hidden)").waitFor();
    await page.evaluate(() => document.querySelector("[data-page-link='academy']").click());
    await page.locator("#academyPage:not(.hidden)").waitFor();
    await page.locator("#langToggle").click();
    assert.equal(await page.locator(".academy-page").getAttribute("dir"), "ltr");
    await page.locator("#langToggle").click();
    await page.locator("#themeToggle").click();
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({ path: new URL(`../.backup/qa/academy-${label}.png`, import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"), fullPage: true });
    assert.deepEqual(errors, []);
    console.log(`PASS ${label} navigation, language, theme, fonts and assets`);
    await context.close();
  }
} finally {
  await browser.close();
}
