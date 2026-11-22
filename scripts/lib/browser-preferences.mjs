import { academyApp } from "../../src/features/academy-app/paths.js";

export async function createPreferenceContext(browser, { locale, theme, ...options }) {
  const context = await browser.newContext(options);
  await context.addInitScript(
    ({ locale, theme, invitationKey }) => {
      localStorage.setItem("portfolio_locale", locale);
      localStorage.setItem("academy_theme", theme);
      sessionStorage.setItem(invitationKey, "1");
    },
    { locale, theme, invitationKey: academyApp.invitationKey },
  );
  return context;
}
