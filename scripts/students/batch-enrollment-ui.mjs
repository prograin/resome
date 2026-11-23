import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import { and, eq } from "drizzle-orm";
import { courseDefinitions, courses } from "../../src/lib/db/schema/index.js";
import { adminCourseCopy } from "../../src/features/academy-admin/course-copy.js";
import { studentPaths } from "../../src/lib/student-auth/paths.js";
import { checkFormRecovery } from "./form-recovery.mjs";

export async function checkBatchEnrollmentUI(fixture, db, context, locale, engine, studentContext) {
  const { origin, admin, password } = fixture;
  const copy = adminCourseCopy[locale];
  const login = await context.request.post(origin + "/api/auth/sign-in/username/", {
    headers: { Origin: origin },
    data: { username: admin, password },
  });
  assert.equal(login.status(), 200);
  const [definition] = await db
    .insert(courseDefinitions)
    .values({ title: `Batch ${engine}` })
    .returning();
  const page = await context.newPage();
  await page.goto(origin + studentPaths.adminCourses + definition.id + "/students/");
  await page.getByRole("button", { name: copy.enroll, exact: true }).click();
  const dialog = page.getByRole("dialog", { name: copy.enroll, exact: true });
  const form = dialog.locator("form");
  const submit = form.locator('button[type="submit"]');
  assert.equal(await submit.isDisabled(), true);
  const trigger = form.locator('[data-multi-select-name="studentIds"]');
  await trigger.click();
  const popup = page.locator(".ui-multi-select__content");
  const search = popup.getByRole("searchbox");
  await search.fill("علي");
  const alice = popup.locator('[data-select-value="batch_alice"]');
  await alice.check();
  await search.fill("batch_bob");
  const bob = popup.locator('[data-select-value="batch_bob"]');
  await bob.check();
  await bob.focus();
  await bob.press("Space");
  assert.equal(await bob.isChecked(), false);
  await bob.press("Space");
  assert.deepEqual(JSON.parse(await form.locator('[name="studentIds"]').inputValue()), [
    "batch_alice",
    "batch_bob",
  ]);
  await search.fill("not-present");
  await popup.getByText(copy.noMatches, { exact: true }).waitFor();
  await search.fill("");
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  assert.deepEqual(
    accessibility.violations.map((issue) => ({
      id: issue.id,
      targets: issue.nodes.map((node) => node.target),
    })),
    [],
  );
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: `.backup/batch-enrollment-${engine}.png` });
  await search.press("Escape");
  await popup.waitFor({ state: "hidden" });
  assert.equal(await dialog.isVisible(), true, "Escape closes only the nested dropdown");
  assert.equal(await trigger.evaluate((node) => node === document.activeElement), true);
  if (engine === "edge") await checkFormRecovery(page, form, submit, "failed");
  const capture = page.waitForRequest(
    (request) => request.method() === "POST" && Boolean(request.headers()["next-action"]),
  );
  await submit.click();
  const request = await capture;
  await dialog.waitFor({ state: "hidden" });
  const enrollments = () =>
    db.select().from(courses).where(eq(courses.definitionId, definition.id));
  assert.equal((await enrollments()).length, 2);
  const replay = (target) =>
    target.request.post(request.url(), {
      headers: {
        Origin: origin,
        "next-action": request.headers()["next-action"],
        "content-type": request.headers()["content-type"],
      },
      data: request.postDataBuffer(),
    });
  assert.match(await (await replay(studentContext)).text(), /forbidden/);
  assert.match(await (await replay(context)).text(), /duplicateEnrollment/);
  assert.equal((await enrollments()).length, 2);
  assert.equal(
    (
      await db
        .select()
        .from(courses)
        .where(and(eq(courses.definitionId, definition.id), eq(courses.studentId, "batch_alice")))
    ).length,
    1,
  );
  await page.close();
  console.log(
    `PASS searchable multiple enrollment, preserved selection/errors, keyboard, accessibility and authorization: ${engine}/${locale}`,
  );
}
