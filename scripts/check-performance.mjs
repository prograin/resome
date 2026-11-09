// Deterministic transfer budgets and lazy-loading checks, separate from lab scores.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const origin = process.env.SITE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const [route, chunk, cssBudget, jsBudget] of [
    ["/", "home", 40000, 50000],
    ["/academy/", "academy", 60000, 60000],
    ["/order/", "order", 55000, 65000],
    ["/contact/", "contact", 45000, 50000],
  ]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const requests = [];
    const bodies = [];
    page.on("request", (request) => requests.push(request.url()));
    page.on("response", (response) => {
      const type = response.request().resourceType();
      if (["script", "stylesheet"].includes(type))
        bodies.push(response.body().then((body) => ({ type, bytes: body.length })));
    });
    await page.goto(`${origin}${route}`);
    await page.waitForLoadState("networkidle");
    const resources = await Promise.all(bodies);
    const css = resources
      .filter((item) => item.type === "stylesheet")
      .reduce((sum, item) => sum + item.bytes, 0);
    const js = resources
      .filter((item) => item.type === "script")
      .reduce((sum, item) => sum + item.bytes, 0);
    assert.ok(css <= cssBudget, `${route} CSS: ${css}`);
    assert.ok(js <= jsBudget, `${route} JS: ${js}`);
    assert.equal(
      requests.some((url) => /chunks\/resume|\/data\.js|\/output\.css/.test(url)),
      false,
    );
    assert.deepEqual(
      requests.filter((url) => url.includes("/chunks/")).map((url) => new URL(url).pathname),
      [`/src/chunks/${chunk}.js`],
    );
    assert.equal(await page.evaluate(() => window.PORTFOLIO_DATA_I18N.fa.projects), undefined);
    assert.equal(
      await page.locator('script[src*="/src/app.js"]').evaluate((element) => element.defer),
      true,
    );
    console.log(`PASS mobile budget ${route}: CSS ${css}, JS ${js} bytes; portfolio excluded`);
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/src/chunks/academy.js?*", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    await route.continue();
  });
  await page.goto(origin);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => {
    document.querySelector('[data-page-link="academy"]').click();
    document.querySelector('[data-page-link="order"]').click();
  });
  await page.waitForLoadState("networkidle");
  assert.equal(await page.locator("#orderPage").isVisible(), true);
  assert.equal(await page.locator("#academyPage").isVisible(), false);
  await page.locator("#langToggle").click();
  await page.waitForFunction(() => document.querySelector(".order-page")?.dir === "ltr");
  await page.evaluate(() => {
    history.pushState({}, "", "/resume/");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await page.waitForFunction(() => document.querySelector("#projectsGrid").children.length > 0);
  assert.ok(await page.locator("#projectsGrid > *").count());
  assert.equal(await page.locator("#siteFooter").isVisible(), false);
  assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
  assert.deepEqual(errors, []);
  console.log("PASS delayed chunks, rapid navigation, language and lazy portfolio rendering");
  await context.close();
} finally {
  await browser.close();
}
