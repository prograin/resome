import assert from "node:assert/strict";
import { chromium } from "playwright";

const origin = process.env.SITE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  // Read what a crawler without JavaScript receives, including the FAQ answers.
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  for (const route of ["/", "/academy/", "/order/", "/contact/"]) {
    const response = await page.goto(`${origin}${route}`);
    assert.equal(response.status(), 200);
    const view = page.locator("[data-page]:not(.hidden)");
    assert.equal(await view.locator("h1").count(), 1);
    assert.ok((await view.innerText()).trim().length > 250);
    assert.equal(
      await page.locator('link[rel="canonical"]').getAttribute("href"),
      `https://prograin.ir${route}`,
    );
    assert.equal(
      await page.locator('meta[name="robots"]').getAttribute("content"),
      "index, follow, max-image-preview:large",
    );
    if (["/academy/", "/order/"].includes(route)) {
      const question = page.locator(".faq-item").first();
      await question.locator("summary").click();
      assert.equal(await question.locator("p").isVisible(), true);
    }
    console.log(`PASS no-JavaScript content, canonical and FAQ: ${route}`);
  }
  for (const alias of ["resume", "portfolio", "portfoilio"]) {
    const response = await page.goto(`${origin}/${alias}/`);
    assert.equal(response.status(), 200);
    assert.equal(new URL(page.url()).pathname, `/${alias}/`);
    assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
  }
  await context.close();

  // The hydrated metadata must match the initial response and stay correct on navigation.
  const interactive = await browser.newContext();
  const app = await interactive.newPage();
  const errors = [];
  app.on("pageerror", (error) => errors.push(error.message));
  await app.goto(origin);
  for (const [key, path] of [
    ["academy", "/academy/"],
    ["order", "/order/"],
    ["contact-page", "/contact/"],
    ["home", "/"],
  ]) {
    await app.evaluate((key) => document.querySelector(`[data-page-link="${key}"]`).click(), key);
    await app.waitForURL(`${origin}${path}`);
    const canonical = await app.locator('link[rel="canonical"]').getAttribute("href");
    assert.equal(canonical, `https://prograin.ir${path}`);
    assert.equal(await app.locator('meta[property="og:url"]').getAttribute("content"), canonical);
    assert.equal(
      await app.locator('meta[property="og:title"]').getAttribute("content"),
      await app.title(),
    );
    assert.equal(await app.locator("#localSeoSchema").count(), 1);
    await app.locator("#langToggle").click();
    assert.equal(await app.locator('meta[property="og:locale"]').getAttribute("content"), "en_US");
    assert.equal(await app.locator('link[rel="canonical"]').getAttribute("href"), canonical);
    await app.locator("#langToggle").click();
  }
  await app.goBack();
  assert.equal(
    await app.locator('link[rel="canonical"]').getAttribute("href"),
    "https://prograin.ir/contact/",
  );
  assert.deepEqual(errors, []);
  console.log("PASS private aliases, client navigation, back button and language metadata");
  await interactive.close();
} finally {
  await browser.close();
}
