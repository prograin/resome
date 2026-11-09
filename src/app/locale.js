import { renderStaticTexts } from "./navigation-labels.js";
import { state, preferences, getData, refreshIcons } from "./state.js";
import { routeFromPath, showPage } from "./router.js";

const LOCALE_KEY = "portfolio_locale";

function applyLocale(locale) {
  state.locale = locale === "fa" ? "fa" : "en";
  preferences.set(LOCALE_KEY, state.locale);

  document.documentElement.setAttribute("lang", state.locale);
  document.documentElement.setAttribute("dir", state.locale === "fa" ? "rtl" : "ltr");
  document.body.classList.toggle("rtl", state.locale === "fa");

  // Update lang button text
  const d = getData();
  const txt = document.getElementById("langToggleText");
  if (txt) txt.textContent = d.ui?.buttons?.language || (state.locale === "fa" ? "EN" : "FA");

  renderAll();
  refreshIcons();
}

function renderAll() {
  renderStaticTexts();
  showPage(routeFromPath());
}

export { applyLocale };
