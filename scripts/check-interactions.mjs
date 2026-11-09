// Regression checks for browser history, native links and restricted storage.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const origin = process.env.SITE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const failures = [];
async function check(name, run, options = {}) {
  const context = await browser.newContext(options);
  try {
    await run(context);
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
    console.log(`FAIL ${name}: ${error.message}`);
  } finally { await context.close(); }
}
try {
  await check("storage unavailable", async (context) => {
    await context.addInitScript(() => Object.defineProperty(window, "localStorage", {
      get() { throw new DOMException("Storage is disabled", "SecurityError"); },
    }));
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(origin);
    await page.locator("#langToggle").click();
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    await page.locator("#themeToggle").click();
    assert.equal(await page.locator("html").evaluate((element) => element.classList.contains("dark")), false);
    assert.deepEqual(errors, []);
  });
  await check("modified and new-tab links retain native behavior", async (context) => {
    const page = await context.newPage();
    await page.goto(`${origin}/academy/`);
    for (const variant of ["ctrl", "meta", "shift", "alt", "target", "download"]) {
      const prevented = await page.evaluate((variant) => {
        const anchor = document.createElement("a");
        anchor.href = "/order/";
        anchor.dataset.pageLink = "order";
        if (variant === "target") anchor.target = "_blank";
        if (variant === "download") anchor.download = "page.html";
        document.body.append(anchor);
        let intercepted;
        document.addEventListener("click", (event) => {
          intercepted = event.defaultPrevented;
          event.preventDefault(); // avoid opening real tabs during this probe
        }, { once: true });
        anchor.dispatchEvent(new MouseEvent("click", {
          bubbles: true, cancelable: true,
          ctrlKey: variant === "ctrl", metaKey: variant === "meta",
          shiftKey: variant === "shift", altKey: variant === "alt",
        }));
        anchor.remove();
        return intercepted;
      }, variant);
      assert.equal(prevented, false, variant);
    }
    assert.equal(new URL(page.url()).pathname, "/academy/");
  });
  await check("hash changes keep the current page", async (context) => {
    const page = await context.newPage();
    await page.goto(`${origin}/academy/`);
    await page.evaluate(() => { location.hash = "section"; });
    await page.waitForURL("**/#section");
    assert.equal(await page.locator("#academyPage").isVisible(), true);
  });
  await check("legacy portfolio fragment loads directly", async (context) => {
    const page = await context.newPage();
    await page.goto(`${origin}/#projects`);
    assert.equal(await page.locator("#resumePage").isVisible(), true);
    assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
  });
  await check("history closes stale dialogs and unlocks the page", async (context) => {
    const page = await context.newPage();
    await page.goto(origin);
    await page.evaluate(() => document.querySelector('[data-page-link="order"]').click());
    await page.waitForURL(`${origin}/order/`);
    await page.locator("[data-pricing-toggle]").first().click();
    assert.equal(await page.locator("#modalOverlay").getAttribute("aria-hidden"), "false");
    await page.goBack();
    await page.waitForURL(`${origin}/`);
    assert.equal(await page.locator("#modalOverlay").getAttribute("aria-hidden"), "true");
    assert.equal(await page.locator(".site-main").evaluate((element) => element.inert), false);
    assert.equal(await page.locator("html").evaluate((element) => element.classList.contains("modal-open")), false);
  });
  await check("home background covers content on short phones", async (context) => {
    const page = await context.newPage();
    await page.goto(origin);
    const geometry = await page.evaluate(() => ({
      hero: document.querySelector(".home-layout").getBoundingClientRect().height,
      background: parseFloat(getComputedStyle(document.querySelector("#homePage"), "::before").height),
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    assert.ok(geometry.background >= geometry.hero - 1, JSON.stringify(geometry));
    assert.equal(geometry.overflow, false);
  }, { viewport: { width: 320, height: 568 } });
} finally { await browser.close(); }
assert.deepEqual(failures, [], failures.join("\n"));
