// script.js (FULL: Theme + Language toggle, RTL/LTR, bilingual rendering)
(() => {
  "use strict";

  if (!window.PORTFOLIO_DATA_I18N) {
    console.error(
      "PORTFOLIO_DATA_I18N not found. Ensure data.js is loaded before script.js.",
    );
    return;
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const preferences = {
    get(key) {
      try { return window.localStorage.getItem(key); }
      catch { return null; }
    },
    set(key, value) {
      // Preferences still work for this visit when browser storage is blocked.
      try { window.localStorage.setItem(key, value); }
      catch { /* Persistence is optional. */ }
    },
  };

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  // -----------------------------
  // Theme
  // -----------------------------
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
    if (icon)
      icon.setAttribute("data-lucide", theme === "dark" ? "sun" : "moon");
    refreshIcons();
  }

  // -----------------------------
  // Language
  // -----------------------------
  const LOCALE_KEY = "portfolio_locale";

  const state = {
    selectedRole: null, // role key
    locale: preferences.get(LOCALE_KEY) === "en" ? "en" : "fa",
    heroExpanded: false,
    currentPage: "home",
  };

  const PAGE_KEYS = ["home", "resume", "order", "academy", "contact-page"];
  const RESUME_HASHES = new Set([
    "resumeHome",
    "filters",
    "skills",
    "projects",
    "experience",
    "education",
    "contact",
  ]);
  const PAGE_PATHS = Object.fromEntries(
    Object.entries(window.SITE_CONFIG.routes).map(([key, route]) => [key, route.path]),
  );
  const PATH_PAGES = {
    "": "home",
    home: "home",
    resume: "resume",
    portfolio: "resume",
    portfoilio: "resume",
    order: "order",
    project: "order",
    projects: "order",
    academy: "academy",
    contact: "contact-page",
    "contact-page": "contact-page",
  };
  const BLOCKED_INDEX_PATHS = new Set(["resume", "portfolio", "portfoilio"]);
  function routeFromHost() {
    const subdomain = window.location.hostname.split(".")[0]?.toLowerCase();
    const hostRoutes = {
      academy: "academy",
      contact: "contact-page",
      order: "order",
      project: "order",
      projects: "order",
    };

    return hostRoutes[subdomain] || "home";
  }

  function routeFromHash() {
    const hash = window.location.hash.replace("#", "");
    if (PAGE_KEYS.includes(hash)) return hash;
    if (RESUME_HASHES.has(hash)) return "resume";
    return routeFromHost();
  }

  function routeFromPath() {
    const firstSegment = window.location.pathname
      .replace(/^\/+|\/+$/g, "")
      .split("/")[0]
      ?.toLowerCase();
    if (!firstSegment || firstSegment === "home") return routeFromHash();
    return PATH_PAGES[firstSegment] || routeFromHash();
  }

  function pagePath(page) {
    return PAGE_PATHS[page] || PAGE_PATHS.home;
  }

  function isBlockedIndexPath() {
    const firstSegment = window.location.pathname
      .replace(/^\/+|\/+$/g, "")
      .split("/")[0]
      ?.toLowerCase();
    return BLOCKED_INDEX_PATHS.has(firstSegment);
  }

  function updateSeo(page) {
    window.SITE_SEO.update(page, state.locale, isBlockedIndexPath());
  }

  let resumeUI = null;
  let pageRequest = 0;

  async function showPage(page = routeFromPath(), options = {}) {
    const nextPage = PAGE_KEYS.includes(page) ? page : "home";
    const request = ++pageRequest;
    if (modal.open) closeModal();
    updateSeo(nextPage);
    try {
      await window.PAGE_LOADER.ensure(nextPage);
    } catch (error) {
      if (request !== pageRequest) return;
      console.error(error);
      if (options.scrollTop) window.location.assign(pagePath(nextPage));
      return;
    }
    if (request !== pageRequest) return;
    window.STATIC_PAGES?.render(nextPage, state.locale);
    if (nextPage === "resume") {
      if (!resumeUI) resumeUI = window.CREATE_RESUME_UI({ state, getData, refreshIcons, modal, openModal });
      resumeUI.render();
    }
    state.currentPage = nextPage;
    document.body.classList.toggle("page-home-active", nextPage === "home");
    document.body.classList.toggle("page-order-active", nextPage === "order");
    document.body.classList.toggle("page-academy-active", nextPage === "academy");
    document.body.classList.toggle("page-resume-active", nextPage === "resume");
    document.body.classList.toggle(
      "page-contact-active",
      nextPage === "contact-page",
    );

    document.querySelectorAll("[data-page]").forEach((view) => {
      view.classList.toggle("hidden", view.getAttribute("data-page") !== nextPage);
    });

    document.querySelectorAll("[data-page-link]").forEach((link) => {
      const active = link.getAttribute("data-page-link") === nextPage;
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
      link.classList.toggle("text-cyan-700", active);
      link.classList.toggle("dark:text-cyan-300", active);
    });

    if (options.scrollTop) {
      window.scrollTo({ top: 0, behavior: options.smooth ? "smooth" : "auto" });
    }

    const hash = window.location.hash.replace("#", "");
    if (nextPage === "resume" && RESUME_HASHES.has(hash)) {
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: options.smooth ? "smooth" : "auto",
          block: "start",
        });
      }, 0);
    }

    if (nextPage === "order") {
      window.setTimeout(() => {
        window.PAGE_ORDER_INIT?.(document.getElementById("orderPage") || document);
      }, 0);
    }

    if (nextPage === "academy") {
      window.setTimeout(() => {
        window.PAGE_ACADEMY_INIT?.(
          document.getElementById("academyPage") || document,
        );
      }, 0);
    }

    refreshIcons();
  }

  function navigateToPage(page, options = {}) {
    const nextPage = PAGE_KEYS.includes(page) ? page : "home";
    const nextPath = pagePath(nextPage);
    if (window.location.pathname !== nextPath || window.location.hash) {
      window.history.pushState({ page: nextPage }, "", nextPath);
    }
    showPage(nextPage, { scrollTop: true, smooth: options.smooth ?? true });
  }

  function getData() {
    return window.PORTFOLIO_DATA_I18N[state.locale];
  }

  function applyLocale(locale) {
    state.locale = locale === "fa" ? "fa" : "en";
    preferences.set(LOCALE_KEY, state.locale);

    document.documentElement.setAttribute("lang", state.locale);
    document.documentElement.setAttribute(
      "dir",
      state.locale === "fa" ? "rtl" : "ltr",
    );
    document.body.classList.toggle("rtl", state.locale === "fa");

    // Update lang button text
    const d = getData();
    const txt = document.getElementById("langToggleText");
    if (txt)
      txt.textContent =
        d.ui?.buttons?.language || (state.locale === "fa" ? "EN" : "FA");

    renderAll();
    refreshIcons();
  }

  // -----------------------------
  // UI helpers
  // -----------------------------
  // -----------------------------
  // Modal
  // -----------------------------
  const modal = {
    overlay: null,
    closeBtn: null,
    kickerEl: null,
    titleEl: null,
    bodyEl: null,
    lastFocus: null,
    open: false,
    background: [],
  };

  function initModal() {
    modal.overlay = $("#modalOverlay");
    modal.closeBtn = $("#modalCloseBtn");
    modal.kickerEl = $("#modalKicker");
    modal.titleEl = $("#modalTitle");
    modal.bodyEl = $("#modalBody");

    modal.closeBtn?.addEventListener("click", closeModal);
    modal.overlay?.addEventListener("click", (e) => {
      if (e.target === modal.overlay) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (!modal.open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key === "Tab") {
        const controls = [...modal.overlay.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')]
          .filter((element) => !element.disabled && element.getClientRects().length);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    });
  }

  function openModal({ kicker, title, htmlBody, kind = "" }) {
    if (modal.open) closeModal();
    modal.lastFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    modal.kickerEl.textContent = kicker || "";
    modal.titleEl.textContent = title || "";
    modal.bodyEl.innerHTML = htmlBody || "";
    modal.bodyEl.scrollTop = 0;
    modal.overlay.dataset.kind = kind;
    modal.closeBtn.setAttribute("aria-label", state.locale === "fa" ? "بستن پنجره" : "Close dialog");
    modal.background = [...document.querySelectorAll(".site-header, .site-main, #siteFooter")]
      .map((element) => ({ element, inert: element.inert }));
    modal.background.forEach(({ element }) => { element.inert = true; });
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");

    modal.overlay.classList.remove("hidden");
    modal.overlay.classList.add("flex");
    modal.overlay.setAttribute("aria-hidden", "false");

    modal.open = true;
    refreshIcons();
    modal.closeBtn?.focus({ preventScroll: true });
  }

  function closeModal() {
    modal.overlay.classList.add("hidden");
    modal.overlay.classList.remove("flex");
    modal.overlay.setAttribute("aria-hidden", "true");

    modal.open = false;
    modal.background.forEach(({ element, inert }) => { element.inert = inert; });
    modal.background = [];
    document.documentElement.classList.remove("modal-open");
    document.body.classList.remove("modal-open");
    modal.bodyEl.innerHTML = "";
    modal.lastFocus?.focus?.();
  }

  window.SITE_MODAL = { open: openModal, close: closeModal };

  // -----------------------------
  // Hide missing images entirely (no placeholder blocks)
  // -----------------------------
  function renderStaticTexts() {
    const d = getData();
    const nav = d.ui?.nav || {};
    const sec = d.ui?.sections || {};
    const btns = d.ui?.buttons || {};

    // Navbar
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    const pageNav =
      state.locale === "fa"
        ? {
            home: "خانه",
            resume: "نمونه‌کارها",
            order: "سفارش پروژه",
            academy: "آکادمی",
            contact: "تماس با ما",
          }
        : {
            home: "Home",
            order: "Order project",
            academy: "Academy",
            contact: "Contact",
          };
    setText("navHomePage", pageNav.home);
    setText("navOrderPage", pageNav.order);
    setText("navAcademyPage", pageNav.academy);
    setText("navContactPage", pageNav.contact);
    setText("mNavHomePage", pageNav.home);
    setText("mNavOrderPage", pageNav.order);
    setText("mNavAcademyPage", pageNav.academy);
    setText("mNavContactPage", pageNav.contact);

    setText("navRoles", nav.roles || "Roles");
    setText("navSkills", nav.skills || "Skills");
    setText("navProjects", nav.projects || "Projects");
    setText("navExperience", nav.experience || "Experience");
    setText("navEducation", nav.education || "Education");
    setText("navContact", nav.contact || "Contact");

    setText("mNavRoles", nav.roles || "Roles");
    setText("mNavAbout", nav.about || "About");
    setText("mNavSkills", nav.skills || "Skills");
    setText("mNavProjects", nav.projects || "Projects");
    setText("mNavExperience", nav.experience || "Experience");
    setText("mNavEducation", nav.education || "Education");
    setText("mNavContact", nav.contact || "Contact");

    // Section titles
    setText("titleRoles", sec.roles || "Roles");
    setText("titleSkills", sec.skills || "Skills");
    setText("titleProjects", sec.projects || "Projects");
    setText("titleExperience", sec.experience || "Experience");
    setText("titleEducation", sec.education || "Education");
    setText("titleContact", sec.contact || "Contact");

    // Theme label
    const themeLabel = document.querySelector("#themeToggle span");
    if (themeLabel) themeLabel.textContent = state.locale === "fa" ? "پوسته" : "Theme";
  }

  // -----------------------------
  // Events
  // -----------------------------
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
      const next = document.documentElement.classList.contains("dark")
        ? "light"
        : "dark";
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
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
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

  // -----------------------------
  // Init
  // -----------------------------
  function renderAll() {
    renderStaticTexts();
    showPage(routeFromPath());
  }

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
})();
