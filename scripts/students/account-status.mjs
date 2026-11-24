import { accountCopy } from "../../src/features/students/account-copy.js";
import { selectOption } from "../lib/select-option.mjs";

export async function selectAccountStatus(page, value, locale = "fa") {
  const copy = accountCopy[locale];
  await page.getByRole("button", { name: copy.action, exact: true }).click();
  const dialog = page.getByRole("dialog", { name: copy.title, exact: true });
  await selectOption(dialog, "status", value);
  const capture = page.waitForRequest(
    (request) => request.method() === "POST" && Boolean(request.headers()["next-action"]),
  );
  await dialog.getByRole("button", { name: copy.save, exact: true }).click();
  const request = await capture;
  await dialog.waitFor({ state: "hidden" });
  return request;
}
