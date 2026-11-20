import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";

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
  assert.equal(await details.locator('[name="firstName"]').isEditable(), false);
  assert.equal(await email.locator('[name="email"]').isEditable(), false);
  assert.equal(await details.locator('button[type="submit"]').count(), 0);
  await details.getByRole("button", { name: "ویرایش اطلاعات فردی", exact: true }).click();
  const beforeName = await details.locator('[name="firstName"]').inputValue();
  await details.locator('[name="firstName"]').fill("Discarded");
  await details.getByRole("button", { name: "لغو", exact: true }).click();
  assert.equal(await details.locator('[name="firstName"]').inputValue(), beforeName);
  assert.equal(await details.locator('[name="firstName"]').isEditable(), false);
  await details.getByRole("button", { name: "ویرایش اطلاعات فردی", exact: true }).click();
  await details.locator('[name="firstName"]').fill("Test");
  await details.locator('[name="lastName"]').fill("Learner");
  await details.locator('[name="github"]').fill("octocat");
  await details.locator('[name="username"]').fill(username.toUpperCase());
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
  assert.equal(user.name, "Test Learner");
  assert.equal(user.github, "octocat");

  await email.getByRole("button", { name: "ویرایش ایمیل", exact: true }).click();
  await email.locator('[name="email"]').fill("discarded@example.test");
  await email.getByRole("button", { name: "لغو", exact: true }).click();
  assert.equal(await email.locator('[name="email"]').inputValue(), "");
  await email.getByRole("button", { name: "ویرایش ایمیل", exact: true }).click();
  await email.locator('[name="email"]').fill(username + "@example.test");
  await save(email);
  await email.getByRole("alert").waitFor();
  assert.ok((await session()).user.email.endsWith("@students.prograin.invalid"));
  const newEmail = other + "@new.example.test";
  await email.locator('[name="email"]').fill(newEmail);
  const captured = page.waitForRequest(
    (request) => request.method() === "POST" && request.headers()["next-action"],
  );
  await save(email);
  const emailRequest = await captured;
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
  assert.equal(user.emailVerified, false);
  await page.reload();
  assert.equal(await details.locator('[name="firstName"]').inputValue(), "Test");
  assert.equal(await details.locator('[name="lastName"]').inputValue(), "Learner");
  assert.equal(await details.locator('[name="github"]').inputValue(), "octocat");
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
