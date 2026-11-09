import { $, state } from "./state.js";
import { applyTheme } from "./theme.js";
import { applyLocale } from "./locale.js";
import { PAGE_KEYS, routeFromPath, showPage, navigateToPage } from "./router.js";

function attachEvents() {
  // mobile menu
  const btn = $("#mobileMenuBtn");
  const menu = $("#mobileMenu");
  if (btn && menu) {
    const closeMenu = () => {
      menu.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    };
    btn.addEventListener("click", () => {
      const open = !menu.classList.contains("hidden");
      menu.classList.toggle("hidden", open);
      btn.setAttribute("aria-expanded", open ? "false" : "true");
    });
    menu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      menu.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || menu.classList.contains("hidden")) return;
      closeMenu();
      btn.focus();
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".site-header")) closeMenu();
    });
  }

  // Theme
  $("#themeToggle")?.addEventListener("click", () => {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
  });

  // Language
  document.getElementById("langToggle")?.addEventListener("click", () => {
    applyLocale(state.locale === "fa" ? "en" : "fa");
  });

  window.addEventListener("hashchange", () => {
    showPage(routeFromPath(), { scrollTop: true, smooth: true });
  });

  window.addEventListener("popstate", () => {
    showPage(routeFromPath(), { scrollTop: true, smooth: false });
  });

  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest("a[data-page-link]");
    if (!link) return;
    if (link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
    if (new URL(link.href).origin !== window.location.origin) return;

    const page = link.getAttribute("data-page-link");
    if (!PAGE_KEYS.includes(page)) return;

    event.preventDefault();
    navigateToPage(page);

    const menu = $("#mobileMenu");
    const btn = $("#mobileMenuBtn");
    menu?.classList.add("hidden");
    btn?.setAttribute("aria-expanded", "false");
  });
}

export { attachEvents };
