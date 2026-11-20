import assert from "node:assert/strict";
import { users } from "../../src/lib/db/schema/auth.js";
import { studentPaths } from "../../src/lib/student-auth/paths.js";
import { studentLinksPageSize } from "../../src/lib/db/student-links.js";

export async function checkInfiniteLinks(fixture, db) {
  const { origin, browser, context } = fixture;
  const url = origin + studentPaths.links;
  await db.insert(users).values(
    Array.from({ length: 20 }, (_, index) => ({
      id: `scroll-${index}`,
      name: "Private name",
      email: `scroll-${index}@private.example.test`,
      username: `scroll_${String(index).padStart(2, "0")}`,
      github: "https://github.com/octocat",
      telegram: index % 3 === 1 ? "" : "https://t.me/learner_test",
      linkedin: index % 3 === 0 ? "https://www.linkedin.com/in/learner" : "",
      website: index % 3 === 0 ? "https://example.test/" : "",
    })),
  );
  const state = await context.storageState();
  const staticContext = await browser.newContext({ storageState: state, javaScriptEnabled: false });
  try {
    const staticPage = await staticContext.newPage();
    await staticPage.goto(url);
    assert.equal(await staticPage.locator(".student-links__card").count(), studentLinksPageSize);
  } finally {
    await staticContext.close();
  }
  const mobile = await browser.newContext({
    storageState: state,
    viewport: { width: 390, height: 520 },
  });
  let captured;
  try {
    const page = await mobile.newPage();
    let blocked = false;
    await page.route(url, async (route) => {
      const request = route.request();
      if (request.method() === "POST" && request.headers()["next-action"]) {
        captured = request;
        if (!blocked) {
          blocked = true;
          return route.fulfill({ status: 503, body: "Temporary test failure" });
        }
      }
      return route.continue();
    });
    await page.goto(url);
    const cards = page.locator(".student-links__grid:visible .student-links__card");
    await cards.first().waitFor();
    assert.equal(await cards.count(), studentLinksPageSize);
    await page.locator(".student-links__load:visible").scrollIntoViewIfNeeded();
    await page.getByRole("alert").filter({ hasText: "ادامهٔ فهرست بارگذاری نشد." }).waitFor();
    assert.equal(await cards.count(), studentLinksPageSize);
    await page.getByRole("button", { name: "تلاش دوباره", exact: true }).click();
    await page.waitForFunction(
      (count) =>
        [...document.querySelectorAll(".student-links__card")].filter(
          (el) => el.getClientRects().length,
        ).length > count,
      studentLinksPageSize,
    );
    for (let iteration = 0; iteration < 8 && (await cards.count()) < 22; iteration++) {
      const before = await cards.count();
      if (before === 22) break;
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForFunction(
        (before) =>
          [...document.querySelectorAll(".student-links__card")].filter(
            (el) => el.getClientRects().length,
          ).length > before,
        before,
      );
    }
    assert.equal(await cards.count(), 22);
    const names = await cards.locator("h2").allTextContents();
    assert.equal(new Set(names).size, 22);
    assert.equal(await page.locator(".student-links__load:visible").count(), 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: ".backup/qa/student-links-infinite-mobile.png" });
  } finally {
    await mobile.close();
  }
  assert.ok(captured, "Scrolling must request another server page");
  const anonymous = await browser.newContext();
  try {
    const denied = await anonymous.request.post(url, {
      headers: {
        Origin: origin,
        "next-action": captured.headers()["next-action"],
        "content-type": captured.headers()["content-type"],
      },
      data: captured.postDataBuffer(),
      maxRedirects: 0,
    });
    assert.ok(
      denied.status() === 303 ||
        denied.headers()["x-action-redirect"]?.includes(studentPaths.signIn),
    );
    assert.ok(!(await denied.text()).includes("scroll_19"));
  } finally {
    await anonymous.close();
  }
  const desktop = await browser.newContext({
    storageState: state,
    viewport: { width: 1440, height: 960 },
  });
  try {
    const page = await desktop.newPage();
    await page.goto(url);
    const boxes = [];
    for (const username of ["scroll_00", "scroll_01", "scroll_02"]) {
      const card = page
        .locator(".student-links__grid:visible .student-links__card")
        .filter({ has: page.getByRole("heading", { name: username, exact: true }) });
      boxes.push(await card.locator(".student-links__actions").boundingBox());
    }
    assert.ok(
      boxes.every((box) => Math.abs(box.y - boxes[0].y) < 1),
      "Cards with one, two and four links must align from the top",
    );
    await page.screenshot({ path: ".backup/qa/student-links-infinite-desktop.png" });
  } finally {
    await desktop.close();
  }
  console.log(
    "PASS infinite links: bounded first page, automatic scroll loading, recovery after error, no duplicates, end of list, authenticated actions and top-aligned links.",
  );
}
