// Application startup. Feature behavior lives in src/app/.
import { state, refreshIcons } from "./app/state.js";
import { initModal } from "./app/modal.js";
import { getPreferredTheme, applyTheme } from "./app/theme.js";
import { applyLocale } from "./app/locale.js";
import { attachEvents } from "./app/events.js";

function init() {
  initModal();
  applyTheme(getPreferredTheme());
  applyLocale(state.locale); // sets RTL/LTR and renders
  attachEvents();
  refreshIcons();
  window.SITE_UPDATES.init();
}

function boot() {
  init();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
