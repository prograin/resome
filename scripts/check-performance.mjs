// Check production asset budgets and ensure public pages do not download the portfolio.
import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import { chromium } from "playwright";

const origin = process.env.SITE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const pages = [
  ["/", "home", 40000],
  ["/academy/", "academy", 60000],
  ["/order/", "order", 55000],
  ["/contact/", "contact", 45000],
];

try {
  for (const [route, name, cssBudget] of pages) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const assets = new Map();
    page.on("response", (response) => {
      const type = response.request().resourceType();
      if (["script", "stylesheet", "image"].includes(type)) {
        assets.set(
          new URL(response.url()).pathname,
          response.body().then((body) => ({ type, body })),
        );
      }
    });
    await page.goto(`${origin}${route}`);
    await page.waitForLoadState("networkidle");
    const css = await assets.get(`/styles/${name}.css`);
    assert.ok(css?.body.length <= cssBudget, `${route} stylesheet budget`);
    const resources = await Promise.all(assets.values());
    const scripts = resources.filter((asset) => asset.type === "script");
    const js = scripts.reduce((bytes, { body }) => bytes + gzipSync(body).length, 0);
    assert.ok(js <= 180000, `${route} compressed JavaScript: ${js} bytes`);
    assert.ok(
      scripts.every(({ body }) => !body.includes("freelancer-etl-dashboard")),
      "Portfolio data in a public route bundle",
    );
    assert.ok([...assets.keys()].every((url) => !url.includes("/src/chunks/")));
    if (route === "/") {
      const backgrounds = [...assets.keys()].filter((url) => url.includes("/optimized/"));
      assert.deepEqual(backgrounds, ["/assets/images/optimized/home-bg-960.webp"]);
    }
    console.log(
      `PASS ${route}: CSS ${css.body.length} B, script gzip estimate ${js} B, portfolio data excluded`,
    );
    await context.close();
  }
} finally {
  await browser.close();
}
