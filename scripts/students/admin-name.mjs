import assert from "node:assert/strict";

export async function checkStudentName({ page, student, origin }) {
  await page.getByRole("button", { name: "ویرایش نام شاگرد", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "ویرایش نام شاگرد" });
  await dialog.locator('[name="firstName"]').fill("Updated");
  await dialog.locator('[name="lastName"]').fill("Student");
  const capture = page.waitForRequest(
    (request) => request.method() === "POST" && Boolean(request.headers()["next-action"]),
  );
  await dialog.getByRole("button", { name: "ذخیرهٔ تغییرات", exact: true }).click();
  const request = await capture;
  await dialog.waitFor({ state: "hidden" });
  const readUser = async () =>
    (await (await student.request.get(origin + "/api/auth/get-session/")).json()).user;
  assert.equal((await readUser()).name, "Updated Student");
  assert.equal((await readUser()).firstName, "Updated");
  assert.equal((await readUser()).lastName, "Student");
  const denied = await student.request.post(request.url(), {
    headers: {
      Origin: origin,
      "next-action": request.headers()["next-action"],
      "content-type": request.headers()["content-type"],
    },
    data: request.postDataBuffer().toString().replaceAll("Updated", "Forbidden"),
  });
  assert.match(await denied.text(), /forbidden/);
  assert.equal((await readUser()).name, "Updated Student");
  console.log("PASS student identity: admin edits names; student replay is forbidden");
}
