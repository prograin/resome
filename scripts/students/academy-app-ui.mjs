import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import { academyApp } from "../../src/features/academy-app/paths.js";

export async function checkAcademyAppUI(fixture) {
  const { page, context, browser, origin } = fixture;
  await context.addInitScript(() => {
    window.addEventListener(
      "beforeinstallprompt",
      (event) => {
        if (event.isTrusted) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      true,
    );
    window.__notificationPrompts = 0;
    Notification.requestPermission = async () => {
      window.__notificationPrompts++;
      return "denied";
    };
  });
  await page.goto(origin + "/");
  assert.equal(await page.locator('link[rel="manifest"]').count(), 0);
  await page.goto(fixture.login);
  const invitation = page.getByRole("dialog", { name: "آکادمی را همراه خود داشته باشید" });
  await invitation.waitFor();
  await invitation.screenshot({ path: ".backup/academy-install-invitation-fa.png" });
  assert.ok((await invitation.innerText()).includes("آمادهٔ نصب است"));
  assert.equal(
    await invitation.getByRole("button", { name: "نصب آکادمی", exact: true }).count(),
    1,
  );
  await invitation.getByRole("button", { name: "فعلاً نه", exact: true }).click();
  await invitation.waitFor({ state: "hidden" });
  assert.ok(
    (await page.locator('link[rel="apple-touch-icon"]').getAttribute("href")).includes(
      "/icons/academy/",
    ),
  );
  assert.equal(
    new URL(await page.locator('link[rel="manifest"]').getAttribute("href"), origin).pathname,
    academyApp.manifest,
  );
  await page.waitForFunction(async () =>
    Boolean((await navigator.serviceWorker.getRegistration("/academy/students/"))?.active),
  );
  await page.reload();
  await page.waitForTimeout(1700);
  assert.equal(await invitation.count(), 0, "The invitation must not reopen in the same session");
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  const cdp = await context.newCDPSession(page);
  const installedManifest = await cdp.send("Page.getAppManifest");
  assert.deepEqual(
    installedManifest.errors.filter((error) => error.critical),
    [],
  );
  assert.equal(JSON.parse(installedManifest.data).scope, academyApp.scope);
  await cdp.detach();
  const install = page.getByRole("button", { name: "نصب آکادمی", exact: true });
  await install.click();
  const guide = page.getByRole("dialog", { name: "نصب آکادمی" });
  await guide.waitFor();
  assert.ok((await guide.innerText()).includes("Safari"));
  const accessible = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  assert.deepEqual(
    accessible.violations.map((issue) => issue.id),
    [],
  );
  await page.keyboard.press("Escape");
  await guide.waitFor({ state: "hidden" });
  await page.evaluate(() => {
    window.__installPrompts = 0;
    const event = new Event("beforeinstallprompt", { cancelable: true });
    event.prompt = async () => {
      window.__installPrompts++;
    };
    event.userChoice = Promise.resolve({ outcome: "accepted", platform: "web" });
    window.dispatchEvent(event);
  });
  await install.click();
  assert.equal(await page.evaluate(() => window.__installPrompts), 1);
  await page.evaluate(() => window.dispatchEvent(new Event("appinstalled")));
  await install.waitFor({ state: "hidden" });
  assert.equal(await page.evaluate(() => window.__notificationPrompts), 0);

  const app = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  await app.addInitScript(() => {
    const original = window.matchMedia.bind(window);
    window.matchMedia = (query) =>
      query === "(display-mode: standalone)"
        ? { matches: true, media: query, addEventListener() {}, removeEventListener() {} }
        : original(query);
  });
  try {
    const login = await app.request.post(origin + "/api/auth/sign-in/username/", {
      headers: { Origin: origin },
      data: { username: fixture.username, password: fixture.password },
    });
    assert.equal(login.status(), 200);
    const screen = await app.newPage();
    await screen.goto(origin + "/contact/");
    await screen.waitForURL(fixture.dashboard);
    await screen.locator('html[data-academy-app="true"]').waitFor();
    await screen
      .locator('.student-shell__footer nav a[href="/academy/students/dashboard/"]')
      .waitFor();
    assert.equal(await screen.locator(".academy-install-button").count(), 0);
    assert.equal(await screen.locator('a[href="/academy/"], a[href="/contact/"]').count(), 0);
    await screen
      .locator('.student-shell__links a[href="/academy/students/dashboard/profile/"]:visible')
      .click();
    await screen.waitForURL(fixture.profile);
    await screen.locator('.site-header__standard button[aria-label="بازگشت"]').click();
    await screen.waitForURL(fixture.dashboard);
    await screen.evaluate(() => {
      const anchor = document.createElement("a");
      anchor.href = "/order/";
      anchor.id = "outside-app";
      anchor.textContent = "Outside";
      document.querySelector("main").append(anchor);
    });
    await screen.locator("#outside-app").click();
    assert.equal(new URL(screen.url()).pathname, "/academy/students/dashboard/");
    await screen.locator("#outside-app").evaluate((node) => node.remove());
    await screen.setViewportSize({ width: 390, height: 844 });
    await screen.locator("#academyMenuButton").click();
    assert.equal(await screen.locator('a[href="/academy/"], a[href="/contact/"]').count(), 0);
    await screen.keyboard.press("Escape");
    await screen.screenshot({ path: ".backup/academy-app-mobile.png" });
    await app.request.post(origin + "/api/auth/sign-out/", {
      headers: { Origin: origin },
      data: {},
    });
    const admin = await app.request.post(origin + "/api/auth/sign-in/username/", {
      headers: { Origin: origin },
      data: { username: fixture.admin, password: fixture.password },
    });
    assert.equal(admin.status(), 200);
    await screen.goto(origin + academyApp.start);
    await screen.waitForURL(origin + "/academy/students/dashboard/admin/");
    await screen.locator('html[data-academy-app="true"]').waitFor();
    await screen
      .locator('.student-shell__footer nav a[href="/academy/students/dashboard/"]')
      .waitFor();
    await screen.screenshot({ path: ".backup/academy-app-admin.png" });
    const outside = screen.locator('a[href="/academy/"], a[href="/contact/"]');
    await screen.waitForFunction(() =>
      [...document.querySelectorAll('a[href="/academy/"], a[href="/contact/"]')].every(
        (node) => !node.getClientRects().length,
      ),
    );
    assert.equal(await outside.filter({ visible: true }).count(), 0);
  } finally {
    await app.close();
  }
  const ios = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    await ios.addInitScript(() => Object.defineProperty(navigator, "standalone", { value: true }));
    const screen = await ios.newPage();
    await screen.goto(origin + "/academy/consultation/");
    await screen.waitForURL(fixture.login);
    await screen.locator('html[data-academy-app="true"]').waitFor();
    assert.equal(await screen.locator(".academy-install-button").count(), 0);
  } finally {
    await ios.close();
  }
  await context.setOffline(true);
  await page.goto(fixture.profile);
  await page.getByRole("heading", { name: "اتصال به اینترنت برقرار نیست" }).waitFor();
  assert.equal(await page.locator('input[name="username"]').count(), 0);
  assert.deepEqual(await page.evaluate(() => caches.keys()), []);
  await context.setOffline(false);
  await page.goto(fixture.login);
  await page.locator('input[name="username"]').waitFor();
  console.log(
    "PASS academy app UI: scoped manifest, real service worker, install prompt/help, app-only navigation/back, browser isolation, offline recovery and no notification permission prompt.",
  );
}
