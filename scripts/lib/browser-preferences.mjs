export async function createPreferenceContext(browser, { locale, theme, ...options }) {
  const context = await browser.newContext(options);
  await context.addInitScript(
    ({ locale, theme }) => {
      localStorage.setItem("portfolio_locale", locale);
      localStorage.setItem("portfolio_theme", theme);
    },
    { locale, theme },
  );
  return context;
}
