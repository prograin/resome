import assert from "node:assert/strict";
import { readFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { chromium } from "playwright";
import { assetVersioner, optimizeImages, assetFingerprint } from "./lib/assets.mjs";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const origin = process.env.SITE_URL || "http://127.0.0.1:4173";
const { version } = JSON.parse(await readFile(new URL("../site-version.json", import.meta.url)));
const rewrite = await assetVersioner(root, version);
assert.equal(
  rewrite('url("../assets/images/home-bg.jpg?v=old#x")'),
  `url(../assets/images/home-bg.jpg?v=${version}#x)`,
);
assert.equal(rewrite('src="/assets/images/x.webp"'), `src="/assets/images/x.webp?v=${version}"`);
const fixture = await mkdtemp(path.join(tmpdir(), "prograin-assets-"));
try {
  await mkdir(path.join(fixture, "assets/images/clients"), { recursive: true });
  const source = path.join(fixture, "assets/images/home-bg.jpg");
  const output = path.join(fixture, "assets/images/optimized/home-bg-960.webp");
  const create = (background) =>
    sharp({ create: { width: 32, height: 32, channels: 3, background } })
      .jpeg()
      .toFile(source);
  await create("red");
  await optimizeImages(fixture);
  const first = await assetFingerprint(fixture);
  const previous = await readFile(output);
  await optimizeImages(fixture);
  assert.equal(await assetFingerprint(fixture), first);
  await create("blue");
  await optimizeImages(fixture);
  assert.notEqual(await assetFingerprint(fixture), first);
  assert.notDeepEqual(await readFile(output), previous);
  console.log(
    "PASS changed originals regenerate WebP and release fingerprint; unchanged builds stay stable",
  );
} finally {
  await rm(fixture, { recursive: true, force: true });
}
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const locale of ["fa", "en"]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    let remote = version;
    let fail = false;
    await page.route("**/site-version.json?*", (route) =>
      fail ? route.abort() : route.fulfill({ json: { version: remote } }),
    );
    await page.goto(`${origin}/order/?source=test#packages`);
    if (locale === "en") await page.locator("#langToggle").click();
    await page.evaluate(() => window.SITE_UPDATES.check());
    assert.equal(await page.locator("#siteUpdateDialog").isVisible(), false);
    const imageUrls = await page
      .locator(".project-showcase img")
      .evaluateAll((images) => images.map((image) => image.src));
    assert.ok(
      imageUrls.length && imageUrls.every((url) => new URL(url).searchParams.get("v") === version),
    );
    remote = version === "aaaaaaaaaaaa" ? "bbbbbbbbbbbb" : "aaaaaaaaaaaa";
    await page.locator("[data-pricing-toggle]").first().click();
    await page.evaluate(() => window.SITE_UPDATES.check());
    assert.equal(await page.locator("#siteUpdateDialog").isVisible(), false);
    await page.keyboard.press("Escape");
    await page.evaluate(() => window.SITE_UPDATES.check());
    await page.locator("#siteUpdateDialog[open]").waitFor();
    assert.equal(
      await page.locator("#siteUpdateApply").textContent(),
      locale === "fa" ? "بروزرسانی" : "Update",
    );
    assert.equal(await page.evaluate(() => document.activeElement.id), "siteUpdateApply");
    const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    assert.deepEqual(
      audit.violations.map((item) => item.id),
      [],
    );
    await page.locator("#siteUpdateLater").click();
    await page.evaluate(() => window.SITE_UPDATES.check());
    assert.equal(await page.locator("#siteUpdateDialog").isVisible(), false);
    remote = "cccccccccccc";
    await page.evaluate(() => window.SITE_UPDATES.check());
    await page.locator("#siteUpdateDialog[open]").waitFor();
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => !document.querySelector("#siteUpdateDialog").open);
    await page.evaluate(() => window.SITE_UPDATES.check());
    assert.equal(await page.locator("#siteUpdateDialog").isVisible(), false);
    remote = "dddddddddddd";
    await page.evaluate(() => window.SITE_UPDATES.check());
    await page.locator("#siteUpdateDialog[open]").waitFor();
    const navigation = page.waitForURL((url) => url.searchParams.get("_site_update") === remote);
    await page.locator("#siteUpdateApply").click();
    await navigation;
    assert.equal(new URL(page.url()).pathname, "/order/");
    assert.equal(new URL(page.url()).searchParams.get("source"), "test");
    assert.equal(new URL(page.url()).hash, "#packages");
    await page.goto(`${origin}/order/?source=test&_site_update=${version}#packages`);
    await page.waitForFunction(() => !location.search.includes("_site_update"));
    fail = true;
    await page.evaluate(() => window.SITE_UPDATES.check());
    assert.equal(await page.locator("#siteUpdateDialog").isVisible(), false);
    await context.close();
    console.log(
      `PASS ${locale}: versioned images, current/new/offline release, accessible dialog, Later, Escape, reload and URL cleanup`,
    );
  }
} finally {
  await browser.close();
}
