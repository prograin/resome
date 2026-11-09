import { $, preferences, refreshIcons } from "./state.js";

const THEME_KEY = "portfolio_theme";
function getPreferredTheme() {
  const saved = preferences.get(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return "dark";
}
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  preferences.set(THEME_KEY, theme);

  const icon = $("#themeToggle [data-lucide]");
  if (icon) icon.setAttribute("data-lucide", theme === "dark" ? "sun" : "moon");
  refreshIcons();
}

export { getPreferredTheme, applyTheme };
