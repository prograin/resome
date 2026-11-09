import "../content/ui/index.js";

const $ = (sel, root = document) => root.querySelector(sel);
const preferences = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    // Preferences still work for this visit when browser storage is blocked.
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* Persistence is optional. */
    }
  },
};

function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

const state = {
  selectedRole: null, // role key
  locale: preferences.get("portfolio_locale") === "en" ? "en" : "fa",
  heroExpanded: false,
  currentPage: "home",
};

function getData() {
  return window.PORTFOLIO_DATA_I18N[state.locale];
}

export { $, preferences, refreshIcons, state, getData };
