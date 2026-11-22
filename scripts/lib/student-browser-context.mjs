import { academyApp } from "../../src/features/academy-app/paths.js";

export async function createStudentContext(browser, options) {
  const context = await browser.newContext(options);
  await context.addInitScript((key) => sessionStorage.setItem(key, "1"), academyApp.invitationKey);
  return context;
}
