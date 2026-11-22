export async function selectOption(scope, name, value) {
  const trigger = scope.locator(`button[data-select-name="${name}"]`);
  if ((await trigger.getAttribute("aria-expanded")) !== "true") await trigger.click();
  const page = typeof scope.page === "function" ? scope.page() : scope;
  await page.locator(`[role="option"][data-select-value="${value}"]`).click();
}
