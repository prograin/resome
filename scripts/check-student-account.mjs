import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { verifyPassword } from "better-auth/crypto";
import AxeBuilder from "@axe-core/playwright";
import { createTestDatabase } from "./lib/test-database.mjs";
import { createStudentFixture } from "./students/fixture.mjs";
import { createStudentContext } from "./lib/student-browser-context.mjs";
import { accounts } from "../src/lib/db/schema/auth.js";
import { studentPaths } from "../src/lib/student-auth/paths.js";

const database = await createTestDatabase("student_account");
let fixture;
let other;
try {
  process.env.STUDENT_TEST_DATABASE_URL = database.url;
  fixture = await createStudentFixture();
  const { page, context, origin, username, password, studentId, browser } = fixture;
  const endpoint = origin + "/api/auth/change-password/";
  const next = randomBytes(20).toString("hex");
  const data = {
    currentPassword: password,
    newPassword: next,
    confirmPassword: next,
    revokeOtherSessions: true,
  };
  const post = (body, headers = { Origin: origin }) =>
    context.request.post(endpoint, { headers, data: body });
  assert.equal((await post(data)).status(), 401);
  const login = async (target) =>
    assert.equal(
      (
        await target.request.post(origin + "/api/auth/sign-in/username/", {
          headers: { Origin: origin },
          data: { username, password },
        })
      ).status(),
      200,
    );
  await login(context);
  other = await createStudentContext(browser);
  await login(other);
  assert.equal((await post({ ...data, confirmPassword: "different-password" })).status(), 400);
  assert.equal((await post({ ...data, userId: "another-student" })).status(), 400);
  assert.equal((await post(data, { Origin: "https://evil.example" })).status(), 403);
  await page.goto(fixture.profile);
  await page.getByRole("link", { name: "تغییر رمز عبور", exact: true }).click();
  await page.waitForURL(origin + studentPaths.password);
  const form = page.getByRole("form", { name: "تغییر رمز عبور" });
  await form.waitFor();
  const fill = async (current, confirm = next) => {
    await form.locator('[name="currentPassword"]').fill(current);
    await form.locator('[name="newPassword"]').fill(next);
    await form.locator('[name="confirmPassword"]').fill(confirm);
  };
  const submit = () => form.getByRole("button", { name: "تغییر رمز عبور", exact: true }).click();
  await fill(password, "different-password");
  await form.getByRole("button", { name: "نمایش رمز: رمز عبور فعلی", exact: true }).click();
  assert.equal(await form.locator('[name="currentPassword"]').getAttribute("type"), "text");
  await form.getByRole("button", { name: "پنهان کردن رمز: رمز عبور فعلی", exact: true }).click();
  await submit();
  await form.getByRole("alert").getByText("رمز جدید و تکرار آن یکسان نیستند.").waitFor();
  await fill("incorrect-password");
  await submit();
  await form.getByRole("alert").getByText("رمز عبور فعلی درست نیست.").waitFor();
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  assert.deepEqual(
    accessibility.violations.map((issue) => issue.id),
    [],
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: ".backup/change-password-mobile.png" });
  await fill(password);
  await submit();
  await form.getByRole("status").getByText("رمز عبور با موفقیت تغییر کرد.").waitFor();
  assert.equal(await form.locator('[name="newPassword"]').inputValue(), "");
  assert.equal(
    (await (await context.request.get(origin + "/api/auth/get-session/")).json()).user.id,
    studentId,
  );
  assert.equal(await (await other.request.get(origin + "/api/auth/get-session/")).json(), null);
  const [account] = await database.db
    .select({ password: accounts.password })
    .from(accounts)
    .where(eq(accounts.userId, studentId));
  assert.equal(await verifyPassword({ hash: account.password, password: next }), true);
  assert.equal(await verifyPassword({ hash: account.password, password }), false);
  let limited;
  for (let index = 0; index < 6; index++) {
    const response = await post(data);
    if (response.status() === 429) {
      limited = response;
      break;
    }
    assert.equal(response.status(), 400);
  }
  assert.ok(limited);
  assert.equal(limited.status(), 429);
  assert.ok(Number(limited.headers()["retry-after"]) > 0);
  console.log(
    "PASS change password: dedicated private page, visibility, confirmation, old-password verification, session revocation, account isolation and rate limits.",
  );
} finally {
  await other?.close();
  try {
    await fixture?.close();
  } finally {
    await database.close();
  }
}
