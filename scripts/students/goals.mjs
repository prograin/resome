import assert from "node:assert/strict";
import { studentPaths } from "../../src/lib/student-auth/paths.js";
import { checkFormRecovery } from "./form-recovery.mjs";

export async function checkGoals({ page, origin, openDashboardPage }) {
  await openDashboardPage("هدف‌ها");
  await page.waitForURL(origin + studentPaths.goals);
  const addGoal = page
    .locator(".student-progress__header")
    .getByRole("button", { name: "افزودن هدف" });
  const goalDialog = page.getByRole("dialog", { name: "افزودن هدف" });
  assert.equal(await page.locator('form[data-add="true"]').count(), 0);
  await addGoal.click();
  await goalDialog.waitFor();
  const newGoal = goalDialog.locator("form");
  const longDescription = "Fixture goal description. ".repeat(10).trim();
  assert.equal(await newGoal.locator('[name="percent"]').count(), 0);
  await newGoal.locator('[name="title"]').fill("Fixture learning goal");
  await newGoal.locator('[name="description"]').fill(longDescription);
  await newGoal.locator('[name="priority"]').selectOption("1");
  await checkFormRecovery(
    page,
    newGoal,
    newGoal.getByRole("button", { name: "افزودن هدف", exact: true }),
    "failed",
    "unavailable",
  );
  await newGoal.getByRole("button", { name: "افزودن هدف", exact: true }).click();
  await goalDialog.waitFor({ state: "hidden" });
  const goal = page
    .locator("li")
    .filter({ has: page.getByRole("heading", { name: "Fixture learning goal" }) });
  await goal.waitFor();
  assert.equal(await goal.getByRole("progressbar").getAttribute("aria-valuenow"), "0");
  assert.equal(await goal.locator('input[type="range"]:disabled').count(), 1);
  assert.equal(await goal.locator("form").count(), 0);
  const description = goal.locator(".student-goal__description");
  assert.ok((await description.innerText()).length < longDescription.length);
  await goal.getByRole("button", { name: "نمایش بیشتر" }).click();
  assert.equal(await description.innerText(), longDescription);
  await goal.getByRole("button", { name: "نمایش کمتر" }).click();
  assert.ok((await description.innerText()).length < longDescription.length);
  await goal.getByRole("button", { name: "ویرایش", exact: true }).click();
  const editGoal = page.getByRole("dialog", { name: "ویرایش" });
  assert.equal(await editGoal.locator('[name="description"]').inputValue(), longDescription);
  await editGoal.locator('[name="description"]').fill("Updated goal description");
  async function setSlider(dialog, value) {
    const slider = dialog.getByRole("slider");
    await slider.press("End");
    assert.equal(await slider.inputValue(), "100");
    assert.equal(
      await slider.evaluate((el) => el.style.getPropertyValue("--goal-slider-fill")),
      "100%",
    );
    await slider.evaluate((input, value) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
    assert.equal(await slider.inputValue(), value);
  }
  await setSlider(editGoal, "45");
  await editGoal.getByRole("button", { name: "ذخیره" }).click();
  await editGoal.waitFor({ state: "hidden" });
  await goal.getByText(/پیشرفت:.*۴۵/).waitFor();
  assert.equal(await goal.getByRole("progressbar").getAttribute("aria-valuenow"), "45");

  return goal;
}
