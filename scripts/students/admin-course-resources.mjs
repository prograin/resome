import assert from "node:assert/strict";

export async function checkAdminCourseResources({ page, card, student, origin }) {
  assert.equal(await card.getByRole("button", { name: "لینک ویدیوها", exact: true }).count(), 0);
  await card.getByRole("button", { name: "ویرایش دوره", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "افزودن ویدیو", exact: true }).click();
  let dialog = page.getByRole("dialog", { name: "افزودن ویدیو", exact: true });
  await dialog.locator('[name="title"]').fill("Shared lesson");
  await dialog.locator('[name="url"]').fill("https://example.test/lesson");
  await dialog.locator('[name="description"]').fill("Shared lesson description");
  const posted = page.waitForRequest((r) => r.method() === "POST" && r.url().startsWith(origin));
  await dialog.getByRole("button", { name: "ثبت", exact: true }).click();
  const request = await posted;
  await dialog.waitFor({ state: "hidden" });
  const denied = await student.request.post(request.url(), {
    headers: {
      Origin: origin,
      "next-action": request.headers()["next-action"],
      "content-type": request.headers()["content-type"],
    },
    data: request.postDataBuffer(),
  });
  assert.match(await denied.text(), /forbidden/);
  await card.getByRole("button", { name: "ویرایش دوره", exact: true }).click();
  await page.getByRole("dialog").getByText("Shared lesson description", { exact: true }).waitFor();
  await page.getByRole("dialog").getByRole("button", { name: "ویرایش لینک ویدیو" }).click();
  dialog = page.getByRole("dialog", { name: "ویرایش لینک ویدیو" });
  assert.equal(await dialog.locator('[name="url"]').inputValue(), "https://example.test/lesson");
  await dialog.locator('[name="title"]').fill("Updated shared lesson");
  await dialog.getByRole("button", { name: "ثبت", exact: true }).click();
  await dialog.waitFor({ state: "hidden" });
  await card.getByRole("button", { name: "ویرایش دوره", exact: true }).click();
  dialog = page.getByRole("dialog", { name: "ویرایش دوره", exact: true });
  assert.equal(await dialog.locator('[name="syllabus"]').inputValue(), "Basics\nAPIs");
  await dialog.locator('[name="github"]').fill("https://github.com/prograin/updated");
  await dialog.getByRole("button", { name: "ثبت", exact: true }).click();
  await dialog.waitFor({ state: "hidden" });
}

export async function checkStudentCourseResources(page) {
  const card = page
    .getByRole("listitem")
    .filter({ has: page.getByRole("heading", { name: "Roster fixture course", exact: true }) });
  assert.equal(
    await card.getByRole("link", { name: "گیت‌هاب" }).getAttribute("href"),
    "https://github.com/prograin/updated",
  );
  await card.getByRole("button", { name: "لینک ویدیوها", exact: true }).click();
  await page.getByRole("dialog").getByText("Updated shared lesson", { exact: true }).waitFor();
  await page.keyboard.press("Escape");
  await card.getByRole("button", { name: "سرفصل‌ها", exact: true }).click();
  await page.getByRole("dialog").getByText("APIs", { exact: true }).waitFor();
  await page.keyboard.press("Escape");
}
