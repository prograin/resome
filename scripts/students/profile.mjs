import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { checkFormRecovery } from "./form-recovery.mjs";

export async function checkProfile({
  page,
  origin,
  profile,
  dashboard,
  other,
  otherId,
  username,
  password,
  signOut,
  submit,
  readEmailCode,
}) {
  await page.goto(profile);
  const details = page.getByRole("form", { name: "اطلاعات فردی" });
  const email = page.getByRole("form", { name: "ایمیل" });
  const save = async (form) => {
    await Promise.all([
      page.waitForResponse((response) => response.request().method() === "POST"),
      form.getByRole("button", { name: "ذخیرهٔ تغییرات" }).click(),
    ]);
    await form.locator('button[type="submit"]:disabled').waitFor({ state: "hidden" });
  };
  const session = async () => (await page.request.get(origin + "/api/auth/get-session/")).json();
  const originalUser = (await session()).user;
  assert.equal(await details.locator('[name="firstName"]').isEditable(), false);
  assert.equal(await email.locator('[name="email"]').isEditable(), false);
  assert.equal(await details.locator('[name="firstName"]').isDisabled(), true);
  assert.equal(await email.locator('[name="email"]').isDisabled(), true);
  assert.equal(await details.locator('button[type="submit"]').count(), 0);
  await details.getByRole("button", { name: "ویرایش اطلاعات فردی", exact: true }).click();
  assert.equal(await details.locator('[name="firstName"]').isDisabled(), false);
  assert.equal(await details.locator('[name="firstName"]').isEditable(), false);
  assert.equal(await details.locator('[name="lastName"]').isEditable(), false);
  await details.locator('[name="username"]').fill("discarded_username");
  await details.getByRole("button", { name: "لغو", exact: true }).click();
  assert.equal(await details.locator('[name="username"]').inputValue(), originalUser.username);
  assert.equal(await details.locator('[name="firstName"]').isEditable(), false);
  assert.equal(await details.locator('[name="firstName"]').isDisabled(), true);
  await details.getByRole("button", { name: "ویرایش اطلاعات فردی", exact: true }).click();
  // A forged form must not turn read-only identity fields into student-editable data.
  await details.locator('[name="firstName"], [name="lastName"]').evaluateAll((inputs) => {
    inputs.forEach((input) => {
      input.readOnly = false;
    });
  });
  await details.locator('[name="firstName"]').fill("Test");
  await details.locator('[name="lastName"]').fill("Learner");
  await details.locator('[name="github"]').fill("https://github.com/octocat");
  await details.locator('[name="telegram"]').fill("https://t.me/learner_test");
  await details.locator('[name="linkedin"]').fill("https://www.linkedin.com/in/learner-test");
  await details.locator('[name="website"]').fill("https://example.test/");
  await details.locator('[name="username"]').fill(username.toUpperCase());
  await checkFormRecovery(
    page,
    details,
    details.getByRole("button", { name: "ذخیرهٔ تغییرات" }),
    "failed",
  );
  await save(details);
  await details.getByRole("alert").waitFor();
  assert.equal((await session()).user.username, other);
  assert.equal(await details.locator('[name="firstName"]').inputValue(), "Test");

  const renamed = other + "_new";
  await details.locator('[name="username"]').fill(renamed);
  await save(details);
  await details.locator('[name="username"][readonly]').waitFor();
  let user = (await session()).user;
  assert.equal(user.id, otherId);
  assert.equal(user.username, renamed);
  assert.equal(user.name, originalUser.name);
  assert.equal(user.firstName, originalUser.firstName);
  assert.equal(user.lastName, originalUser.lastName);
  assert.equal(user.github, "https://github.com/octocat");
  assert.equal(user.telegram, "https://t.me/learner_test");
  assert.equal(user.linkedin, "https://www.linkedin.com/in/learner-test");
  assert.equal(user.website, "https://example.test/");

  await email.getByRole("button", { name: "ویرایش ایمیل", exact: true }).click();
  assert.equal(await email.locator('[name="email"]').isDisabled(), false);
  await email.locator('[name="email"]').fill("discarded@example.test");
  await email.getByRole("button", { name: "لغو", exact: true }).click();
  assert.equal(await email.locator('[name="email"]').inputValue(), "");
  assert.equal(await email.locator('[name="email"]').isDisabled(), true);
  await email.getByRole("button", { name: "ویرایش ایمیل", exact: true }).click();
  const newEmail = other + "@new.example.test";
  await email.locator('[name="email"]').fill(newEmail);
  const send = email.getByRole("button", { name: "ارسال کد تأیید", exact: true });
  await checkFormRecovery(page, email, send, "emailFailed");
  await send.click();
  await email.locator('[name="otp"]').waitFor();
  assert.ok((await session()).user.email.endsWith("@students.prograin.invalid"));
  const code = await readEmailCode(newEmail);
  await email.locator('[name="otp"]').fill(code === "0000" ? "9999" : "0000");
  await checkFormRecovery(
    page,
    email,
    email.getByRole("button", { name: "تأیید و ذخیرهٔ ایمیل", exact: true }),
    "emailFailed",
    "unavailable",
  );
  await email.getByRole("button", { name: "تأیید و ذخیرهٔ ایمیل", exact: true }).click();
  await email.locator('.student-profile__verification [data-status="invalidCode"]').waitFor();
  assert.equal(await email.getByRole("alert").count(), 1);
  assert.equal(
    await email.getByText("کد ارسال‌شده به ایمیلتان را اینجا وارد کنید.", { exact: true }).count(),
    0,
  );
  assert.equal(await email.locator('[name="otp"]').getAttribute("aria-invalid"), "true");
  await email.locator('[name="otp"]').fill(code);
  const captured = page.waitForRequest(
    (request) => request.method() === "POST" && request.headers()["next-action"],
  );
  await email.getByRole("button", { name: "تأیید و ذخیرهٔ ایمیل", exact: true }).click();
  const emailRequest = await captured;
  await email.locator('[name="otp"]').waitFor({ state: "hidden" });
  await email.getByText("ایمیل شما با موفقیت ثبت شد.", { exact: true }).waitFor();
  assert.equal(await email.locator('[name="email"]').isDisabled(), true);
  await email.locator('[name="email"][readonly]').waitFor();
  assert.equal(await email.getByRole("button").count(), 0);
  const payload = emailRequest.postDataBuffer().toString();
  assert.ok(payload.includes(newEmail));
  const denied = await page.request.post(profile, {
    headers: {
      Origin: origin,
      "next-action": emailRequest.headers()["next-action"],
      "content-type": emailRequest.headers()["content-type"],
    },
    data: Buffer.from(payload.replaceAll(newEmail, other + "@replacement.example.test")),
  });
  assert.match(await denied.text(), /emailLocked/);
  user = (await session()).user;
  assert.equal(user.email, newEmail);
  assert.equal(user.emailVerified, true);
  await page.reload();
  assert.equal(await email.getByText("ایمیل شما با موفقیت ثبت شد.", { exact: true }).count(), 0);
  assert.equal(await email.locator('[name="email"]').isDisabled(), true);
  assert.equal(await details.locator('[name="firstName"]').inputValue(), originalUser.firstName);
  assert.equal(await details.locator('[name="lastName"]').inputValue(), originalUser.lastName);
  assert.equal(await details.locator('[name="github"]').inputValue(), "https://github.com/octocat");
  assert.equal(await details.locator('[name="username"]').inputValue(), renamed);
  assert.equal(await email.locator('[name="email"]').inputValue(), newEmail);
  await signOut();
  await delay(10_100);
  await submit(password, other);
  await page.locator('.student-login [role="alert"]').waitFor();
  await page.locator('.student-panel button[type="submit"]:not(:disabled)').waitFor();
  const response = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      /\/api\/auth\/sign-in\/username\/?$/.test(response.url()) &&
      response.status() !== 308,
  );
  await submit(password, renamed.toUpperCase());
  const signedIn = await response;
  assert.equal(signedIn.status(), 200, JSON.stringify(await signedIn.json()));
  await page.waitForURL(dashboard);
  await page.locator(".student-dashboard__main").waitFor();
  assert.equal((await session()).user.id, otherId);
}
