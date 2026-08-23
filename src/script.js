// script.js (FULL: Theme + Language toggle, RTL/LTR, bilingual rendering)
(() => {
  "use strict";

  const I18N = window.PORTFOLIO_DATA_I18N;
  if (!I18N) {
    console.error(
      "PORTFOLIO_DATA_I18N not found. Ensure data.js is loaded before script.js.",
    );
    return;
  }

  const $ = (sel, root = document) => root.querySelector(sel);

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function uniq(arr) {
    return Array.from(new Set(arr));
  }

  function safeExternalLink(url) {
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.protocol !== "http:" && u.protocol !== "https:") return null;
      return u.toString();
    } catch {
      return null;
    }
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function iconMarkup(name, className = "h-4 w-4") {
    const svgClass = escapeHtml(className);

    if (name === "github") {
      return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="${svgClass}"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.426 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.699-2.782.605-3.369-1.343-3.369-1.343-.455-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.071 1.532 1.033 1.532 1.033.892 1.53 2.341 1.088 2.91.832.091-.647.349-1.088.635-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"/></svg>`;
    }

    if (name === "linkedin") {
      return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="${svgClass}"><path d="M6.94 8.5A1.56 1.56 0 1 1 6.94 5.38a1.56 1.56 0 0 1 0 3.12ZM5.5 9.75h2.88V19H5.5V9.75Zm4.69 0h2.76v1.26h.04c.38-.73 1.32-1.5 2.71-1.5 2.9 0 3.43 1.9 3.43 4.38V19h-2.88v-4.53c0-1.08-.02-2.47-1.5-2.47-1.51 0-1.74 1.18-1.74 2.39V19H10.2V9.75Z"/></svg>`;
    }

    if (name === "instagram") {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="${svgClass}"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>`;
    }

    return `<i data-lucide="${escapeHtml(name)}" class="${svgClass}"></i>`;
  }

  // -----------------------------
  // Theme
  // -----------------------------
  const THEME_KEY = "portfolio_theme";
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return "dark";
  }
  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(THEME_KEY, theme);

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
    locale: localStorage.getItem(LOCALE_KEY) === "en" ? "en" : "fa",
    heroExpanded: false,
    currentPage: "home",
  };

  const PAGE_KEYS = ["home", "resume", "order", "academy"];
  const RESUME_HASHES = new Set([
    "resumeHome",
    "filters",
    "skills",
    "projects",
    "experience",
    "education",
    "contact",
  ]);

  function routeFromHost() {
    const subdomain = window.location.hostname.split(".")[0]?.toLowerCase();
    const hostRoutes = {
      academy: "academy",
      order: "order",
      project: "order",
      projects: "order",
      resume: "resume",
    };

    return hostRoutes[subdomain] || "home";
  }

  function routeFromHash() {
    const hash = window.location.hash.replace("#", "");
    if (PAGE_KEYS.includes(hash)) return hash;
    if (RESUME_HASHES.has(hash)) return "resume";
    return routeFromHost();
  }

  function showPage(page = routeFromHash(), options = {}) {
    const nextPage = PAGE_KEYS.includes(page) ? page : "home";
    state.currentPage = nextPage;
    document.body.classList.toggle("page-home-active", nextPage === "home");
    document.body.classList.toggle("page-order-active", nextPage === "order");
    document.body.classList.toggle("page-academy-active", nextPage === "academy");

    document.querySelectorAll("[data-page]").forEach((view) => {
      view.classList.toggle("hidden", view.getAttribute("data-page") !== nextPage);
    });

    document.querySelectorAll("[data-page-link]").forEach((link) => {
      const active = link.getAttribute("data-page-link") === nextPage;
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

    refreshIcons();
  }

  function getData() {
    return I18N[state.locale];
  }

  function applyLocale(locale) {
    state.locale = locale === "fa" ? "fa" : "en";
    localStorage.setItem(LOCALE_KEY, state.locale);

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
  function badgeClass() {
    return "inline-flex items-center rounded-md border border-cyan-200/70 bg-cyan-50/80 px-2 py-1 text-xs font-semibold text-cyan-950 dark:border-cyan-800/60 dark:bg-cyan-950/35 dark:text-cyan-100";
  }
  function cardClass() {
    return "rounded-lg border border-slate-200/80 bg-white/90 p-5 shadow-softer transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-soft backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-cyan-800";
  }
  function buttonPrimaryClass() {
    return "inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-800 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300";
  }
  function buttonSecondaryClass() {
    return "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/85 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-rose-200 hover:bg-rose-50 dark:border-slate-800 dark:bg-slate-950/45 dark:text-slate-100 dark:hover:border-rose-800 dark:hover:bg-rose-950/30";
  }
  function buttonWebsiteClass() {
    return "inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900 shadow-sm hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/35 dark:text-emerald-100 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/55";
  }
  function buttonImagesClass() {
    return "inline-flex items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-900 shadow-sm hover:border-violet-300 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/35 dark:text-violet-100 dark:hover:border-violet-700 dark:hover:bg-violet-950/55";
  }
  function buttonVideoClass() {
    return "inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-900 shadow-sm hover:border-rose-300 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/35 dark:text-rose-100 dark:hover:border-rose-700 dark:hover:bg-rose-950/55";
  }

  function chipClass(active) {
    return [
      "group inline-flex min-h-[58px] items-center gap-3 rounded-lg border px-3 py-2 text-start text-sm font-semibold transition shadow-sm",
      active
        ? "border-cyan-700 bg-cyan-700 text-white dark:border-cyan-300 dark:bg-cyan-300 dark:text-slate-950"
        : "border-slate-200 bg-white/85 text-slate-800 hover:border-cyan-200 hover:bg-cyan-50/70 dark:border-slate-800 dark:bg-slate-950/45 dark:text-slate-100 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/25",
    ].join(" ");
  }

  // role display name from localized roles list
  function roleNameByKey(key) {
    const d = getData();
    const r = (d.roles || []).find((x) => x.key === key);
    return r?.name || key;
  }

  function getProjectFilters() {
    const d = getData();
    const configured = d.ui?.projectFilters;
    if (Array.isArray(configured) && configured.length) return configured;

    return [
      {
        key: "all",
        name: state.locale === "fa" ? "همه" : "All work",
        hint: state.locale === "fa" ? "تمام نمونه‌کارها" : "Everything",
        icon: "layout-grid",
        roles: null,
      },
      ...(d.roles || []).map((role) => ({
        key: role.key,
        name: role.name,
        hint: role.blurb || "",
        icon: role.icon || "circle",
        roles: [role.key],
      })),
    ];
  }

  function filterByKey(key) {
    return getProjectFilters().find((filter) => filter.key === key) || null;
  }

  function selectedFilterRoles() {
    if (!state.selectedRole) return null;
    const roles = filterByKey(state.selectedRole)?.roles;
    return Array.isArray(roles) && roles.length ? roles : null;
  }

  function filterNameByKey(key) {
    return filterByKey(key)?.name || roleNameByKey(key);
  }

  function projectMatchesRoles(project, roles) {
    if (!roles || !roles.length) return true;
    return (project.roles || []).some((role) => roles.includes(role));
  }

  function projectMatchesFilter(project, filter) {
    if (!filter || filter.key === "all") return true;
    if (Array.isArray(filter.projectIds) && filter.projectIds.length) {
      return filter.projectIds.includes(project.id);
    }
    return projectMatchesRoles(project, filter.roles);
  }

  function orderProjectsForFilter(projects, filter) {
    if (!filter || !Array.isArray(filter.projectIds) || !filter.projectIds.length) {
      return projects;
    }
    const order = new Map(filter.projectIds.map((id, index) => [id, index]));
    return [...projects].sort(
      (a, b) =>
        (order.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
      (order.get(b.id) ?? Number.MAX_SAFE_INTEGER),
    );
  }

  function privateShareBullets(project) {
    if (Array.isArray(project.shareableDetails) && project.shareableDetails.length) {
      return project.shareableDetails.slice(0, 6);
    }

    const roles = project.roles || [];

    if (state.locale === "fa") {
      const bullets = [
        "این پروژه در محیط واقعی و برای نیاز عملیاتی یک تیم انجام شده است؛ فقط نام ابزارها، ساختار داخلی و اطلاعات حساس نمایش داده نمی‌شود.",
      ];
      if (roles.includes("DataEng")) {
        bullets.push("داده‌های خام را به خروجی قابل استفاده برای گزارش‌گیری، پیگیری وضعیت و تصمیم‌گیری مدیریتی تبدیل کردم.");
      }
      if (roles.includes("Backend")) {
        bullets.push("جریان‌های سمت سرور، منطق دسترسی، اعتبارسنجی و رفتار قابل اتکا برای استفاده روزمره کاربران را طراحی و پیاده‌سازی کردم.");
      }
      if (roles.includes("Frontend") || roles.includes("Fullstack")) {
        bullets.push("در بخش محصول، مسیرهای کاری را ساده‌تر کردم تا کاربر سریع‌تر به اطلاعات یا عملیات مورد نیاز برسد.");
      }
      if (roles.includes("Desktop")) {
        bullets.push("خروجی کار یک ابزار داخلی برای کاهش کارهای دستی، نظم دادن به اطلاعات و سریع‌تر کردن کارهای تکراری بود.");
      }
      return bullets.slice(0, 5);
    }

    const bullets = [
      "Real production work for an operational team; tool names, internal structure, and sensitive details are intentionally hidden.",
    ];
    if (roles.includes("DataEng")) {
      bullets.push("Turned raw operational data into usable reporting, status tracking, and management-facing insight.");
    }
    if (roles.includes("Backend")) {
      bullets.push("Designed and implemented server-side flows, access logic, validation, and reliable day-to-day behavior.");
    }
    if (roles.includes("Frontend") || roles.includes("Fullstack")) {
      bullets.push("Simplified product workflows so users could reach the right information or action faster.");
    }
    if (roles.includes("Desktop")) {
      bullets.push("Delivered an internal tool that reduced manual work, organized information, and sped up repeated tasks.");
    }
    return bullets.slice(0, 5);
  }

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
      if (e.key === "Escape") closeModal();
    });
  }

  function openModal({ kicker, title, htmlBody }) {
    modal.lastFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    modal.kickerEl.textContent = kicker || "";
    modal.titleEl.textContent = title || "";
    modal.bodyEl.innerHTML = htmlBody || "";

    modal.overlay.classList.remove("hidden");
    modal.overlay.classList.add("flex");
    modal.overlay.setAttribute("aria-hidden", "false");

    modal.open = true;
    refreshIcons();
    setTimeout(() => modal.closeBtn?.focus(), 0);
  }

  function closeModal() {
    modal.overlay.classList.add("hidden");
    modal.overlay.classList.remove("flex");
    modal.overlay.setAttribute("aria-hidden", "true");

    modal.open = false;
    modal.bodyEl.innerHTML = "";
    modal.lastFocus?.focus?.();
  }

  // -----------------------------
  // Hide missing images entirely (no placeholder blocks)
  // -----------------------------
  function mountHideMissingImages(root = document) {
    const imgs = Array.from(
      root.querySelectorAll("img[data-hide-on-error='1']"),
    );
    for (const img of imgs) {
      img.addEventListener("error", () => {
        const container = img.closest("[data-img-container='1']");
        if (container) container.remove();
        else img.remove();
      });
    }
  }

  // -----------------------------
  // Rendering
  // -----------------------------
  function linkPill(label, href, icon) {
    const url =
      safeExternalLink(href) ||
      (href && href.startsWith("mailto:") ? href : null);
    const safeHref = url || "#";
    const disabled = safeHref === "#";
    const isRtl = state.locale === "fa";
    const dir = isRtl ? "rtl" : "ltr";

    const activeByIcon = {
      github:
        "border-slate-300 bg-slate-950 text-white hover:bg-slate-800 dark:border-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200",
      linkedin:
        "border-sky-200 bg-sky-600 text-white hover:bg-sky-700 dark:border-sky-800 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300",
      instagram:
        "border-pink-200 bg-pink-600 text-white hover:bg-pink-700 dark:border-pink-900 dark:bg-pink-500 dark:text-white dark:hover:bg-pink-400",
      youtube:
        "border-red-200 bg-red-600 text-white hover:bg-red-700 dark:border-red-900 dark:bg-red-500 dark:text-white dark:hover:bg-red-400",
      mail: "border-cyan-200 bg-white/95 text-cyan-900 hover:bg-cyan-50 dark:border-cyan-800 dark:bg-slate-950/60 dark:text-cyan-100 dark:hover:bg-cyan-950/40",
    };

    const cls = disabled
      ? "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
      : activeByIcon[icon] ||
        "border-slate-200 bg-white/90 text-slate-800 hover:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-100 dark:hover:bg-slate-900/70";

    const iconHtml = iconMarkup(icon, "h-5 w-5 shrink-0");
    const labelHtml = `<span dir="${dir}">${escapeHtml(label)}</span>`;
    const content = isRtl ? `${labelHtml}${iconHtml}` : `${iconHtml}${labelHtml}`;

    return `<a class="inline-flex min-h-11 items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm font-semibold shadow-softer transition hover:-translate-y-0.5 ${cls}"
      dir="ltr"
      href="${escapeHtml(safeHref)}"
      ${safeHref.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}
      aria-label="${escapeHtml(label)}">
      ${content}
    </a>`;
  }

  function contactCard(title, href, subtitle, icon) {
    const url =
      safeExternalLink(href) ||
      (href && href.startsWith("mailto:") ? href : null);
    const safeHref = url || "#";
    const isRtl = state.locale === "fa";
    const dir = isRtl ? "rtl" : "ltr";
    const arrowIcon = isRtl ? "arrow-left" : "arrow-right";
    const arrowClass =
      "mt-1 shrink-0 text-slate-400 transition group-hover:text-slate-700 dark:group-hover:text-slate-200";
    const arrowMoveClass = isRtl
      ? "group-hover:-translate-x-0.5"
      : "group-hover:translate-x-0.5";
    const iconHtml = `<div class="mt-0.5 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200">
        ${iconMarkup(icon, "h-6 w-6")}
      </div>`;
    const textHtml = `<div class="min-w-0 flex-1 ${isRtl ? "text-right" : ""}" dir="${dir}">
        <p class="text-sm font-semibold text-slate-950 dark:text-white">${escapeHtml(title)}</p>
        <p class="mt-1 truncate text-xs text-slate-600 dark:text-slate-300">${escapeHtml(subtitle)}</p>
      </div>`;
    const arrowHtml = `<div class="${arrowClass} ${arrowMoveClass}">
        <i data-lucide="${arrowIcon}" class="h-4 w-4"></i>
      </div>`;
    const content = isRtl
      ? `${arrowHtml}${textHtml}${iconHtml}`
      : `${iconHtml}${textHtml}${arrowHtml}`;

    return `<a href="${escapeHtml(safeHref)}"
      class="group flex min-w-[220px] flex-1 items-start gap-3 rounded-lg border border-slate-200 bg-white/90 p-4 shadow-softer backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50/60 dark:border-slate-800 dark:bg-slate-950/45 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/25"
      dir="ltr"
      ${safeHref.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}
      aria-label="${escapeHtml(title)}"
    >
      ${content}
    </a>`;
  }

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

    const pageNav = {
      home: "Home",
      resume: "Resume",
      order: "Order project",
      academy: "Academy",
    };

    setText("navHomePage", pageNav.home);
    setText("navResumePage", pageNav.resume);
    setText("navOrderPage", pageNav.order);
    setText("navAcademyPage", pageNav.academy);
    setText("mNavHomePage", pageNav.home);
    setText("mNavResumePage", pageNav.resume);
    setText("mNavOrderPage", pageNav.order);
    setText("mNavAcademyPage", pageNav.academy);

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
    if (themeLabel) themeLabel.textContent = btns.theme || "Theme";
  }

  function renderTop() {
    const DATA = getData();

    $("#navName").textContent = DATA.personal.name || "Portfolio";
    $("#heroKicker").textContent = DATA.ui?.heroKicker || "";
    $("#heroName").textContent = DATA.personal.name || "";
    $("#heroTitle").textContent = DATA.personal.title || "";
    $("#heroSummary").textContent = DATA.personal.about || "";
    const heroSummaryMobile = $("#heroSummaryMobile");
    if (heroSummaryMobile) {
      heroSummaryMobile.textContent =
        state.heroExpanded
          ? DATA.personal.about || ""
          : DATA.personal.mobileAbout || DATA.personal.about || "";
    }

    const heroSummaryToggle = $("#heroSummaryToggle");
    const heroSummaryToggleText = $("#heroSummaryToggleText");
    if (heroSummaryToggle && heroSummaryToggleText) {
      heroSummaryToggleText.textContent = state.heroExpanded
        ? DATA.ui?.buttons?.showLess || "Show less"
        : DATA.ui?.buttons?.showMore || "Show more";
      heroSummaryToggle.setAttribute(
        "aria-expanded",
        state.heroExpanded ? "true" : "false",
      );
    }

    const availabilityTitle = $("#heroAvailabilityTitle");
    const availabilityText = $("#heroAvailabilityText");
    if (availabilityTitle) {
      availabilityTitle.textContent =
        DATA.ui?.heroAvailabilityTitle ||
        (state.locale === "fa" ? "آماده همکاری" : "Available for work");
    }
    if (availabilityText) {
      availabilityText.textContent =
        DATA.ui?.heroAvailabilityText ||
        (state.locale === "fa"
          ? "بک‌اند، داده، فول‌استک و یادگیری ماشین"
          : "Backend, data, full-stack, and ML");
    }

    const heroNumber = $("#heroNumber");
    if (heroNumber) heroNumber.textContent = DATA.personal.number || "";
    const heroPhone = $("#heroPhone");
    if (heroPhone) {
      heroPhone.href = DATA.personal.number ? `tel:${DATA.personal.number}` : "#";
    }
    $("#heroLocation").textContent = DATA.personal.location || "";

    const emailEl = $("#heroEmail");
    const emailTextEl = $("#heroEmailText");
    if (emailEl) {
      if (emailTextEl) emailTextEl.textContent = DATA.personal.email || "";
      else emailEl.textContent = DATA.personal.email || "";
      emailEl.href = DATA.personal.email ? `mailto:${DATA.personal.email}` : "#";
    }

    const modesEl = document.getElementById("heroWorkModes");
    if (modesEl) {
      const modes = Array.isArray(DATA.personal.workModes)
        ? DATA.personal.workModes.join(" / ")
        : "";
      modesEl.textContent = modes || DATA.personal.employmentType || "";
    }

    const rolesHint = $("#rolesHint");
    if (rolesHint) {
      const hint = DATA.ui?.rolesHint || "";
      rolesHint.textContent = hint;
      rolesHint.classList.toggle("hidden", !hint);
    }
    $("#contactHint").textContent = DATA.ui?.contactHint || "";

    const cvBtn = $("#cvBtn");
    if (cvBtn) cvBtn.href = DATA.ui?.cvUrl || "#";

    $("#heroLinks").innerHTML = [
      linkPill("GitHub", DATA.personal.links?.github, "github"),
      linkPill("LinkedIn", DATA.personal.links?.linkedin, "linkedin"),
      linkPill("Instagram", DATA.personal.links?.instagram, "instagram"),
      linkPill("YouTube", DATA.personal.links?.youtube, "youtube"),
      linkPill(
        "Email",
        DATA.personal.email ? `mailto:${DATA.personal.email}` : "#",
        "mail",
      ),
    ].join("");

    $("#contactLinks").innerHTML = [
      contactCard(
        state.locale === "fa" ? "ایمیل" : "Email",
        DATA.personal.email ? `mailto:${DATA.personal.email}` : "#",
        DATA.personal.email || "",
        "mail",
      ),
      contactCard(
        "GitHub",
        DATA.personal.links?.github || "#",
        "github.com",
        "github",
      ),
      contactCard(
        "LinkedIn",
        DATA.personal.links?.linkedin || "#",
        "linkedin.com",
        "linkedin",
      ),
      contactCard(
        "Instagram",
        DATA.personal.links?.instagram || "#",
        "prograin_",
        "instagram",
      ),
      contactCard(
        "YouTube",
        DATA.personal.links?.youtube || "#",
        "@Prograin_ARR",
        "youtube",
      ),
    ].join("");

    refreshIcons();
  }

  // -----------------------------
  // Roles chips
  // -----------------------------
  function setSelectedProjectFilter(key, options = {}) {
    const normalized = key && key !== "all" && filterByKey(key) ? key : null;
    state.selectedRole =
      options.toggle && normalized && state.selectedRole === normalized
        ? null
        : normalized;

    renderChips();
    renderProjectFilterSelect();
    renderActiveRolePill();
    renderSkills();
    renderProjects();

    if (options.scroll) {
      document.getElementById("projects")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function renderChips() {
    const DATA = getData();
    const wrap = $("#roleChips");
    const projects = DATA.projects || [];
    const filters = getProjectFilters();

    wrap.innerHTML = filters.map((filter) => {
      const key = filter.key;
      const active =
        (!state.selectedRole && key === "all") || state.selectedRole === key;
      const count = projects.filter((project) =>
        projectMatchesFilter(project, filter),
      ).length;
      const icon = active ? "check-circle-2" : filter.icon || "circle";
      const label = filter.name || key;
      const hint = filter.hint || "";

      return `<button type="button"
          class="${chipClass(active)}"
          data-chip-type="role"
          data-chip-value="${escapeHtml(key)}"
          aria-pressed="${active ? "true" : "false"}"
        >
          <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${active ? "bg-white/15 dark:bg-slate-900/10" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}">
            <i data-lucide="${escapeHtml(icon)}" class="h-4 w-4"></i>
          </span>
          <span class="min-w-0">
            <span class="block leading-5">${escapeHtml(label)}</span>
            ${
              hint
                ? `<span class="mt-0.5 block text-xs font-medium leading-4 ${active ? "text-white/75 dark:text-slate-900/65" : "text-slate-500 dark:text-slate-400"}">${escapeHtml(hint)}</span>`
                : ""
            }
          </span>
          <span class="ms-auto inline-flex min-w-7 justify-center rounded-md border px-1.5 py-0.5 text-xs ${active ? "border-white/20 bg-white/10 dark:border-slate-900/10 dark:bg-slate-900/5" : "border-slate-200 bg-white/70 text-slate-500 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-400"}">${count}</span>
        </button>`;
    }).join("");

    refreshIcons();
  }

  function renderProjectFilterSelect() {
    const DATA = getData();
    const select = $("#projectFilterSelect");
    if (!select) return;

    const filters = getProjectFilters();
    const labelText =
      DATA.ui?.sections?.roles ||
      (state.locale === "fa" ? "فیلتر پروژه‌ها" : "Project filter");

    select.setAttribute("aria-label", labelText);

    select.innerHTML = filters
      .map((filter) => {
        const label = filter.name || filter.key;
        return `<option value="${escapeHtml(filter.key)}">${escapeHtml(label)}</option>`;
      })
      .join("");

    select.value = state.selectedRole || "all";
  }

  function matchesRole(project) {
    return projectMatchesFilter(project, filterByKey(state.selectedRole));
  }

  function renderActiveRolePill() {
    const DATA = getData();
    const wrap = $("#activeRolePill");
    if (!wrap) return;

    if (!state.selectedRole) {
      wrap.classList.add("hidden");
      wrap.innerHTML = "";
      return;
    }

    wrap.classList.remove("hidden");
    wrap.innerHTML = `
      <div class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/75 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100">
        <i data-lucide="filter" class="h-4 w-4 text-slate-500"></i>
        <span>${escapeHtml(filterNameByKey(state.selectedRole))}</span>
        <button type="button"
          class="ml-1 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          aria-label="${escapeHtml(DATA.ui?.buttons?.clearRole || "Clear")}"
          id="pillClearBtn">
          <i data-lucide="x" class="h-3.5 w-3.5"></i>
        </button>
      </div>
    `;
    refreshIcons();
    document.getElementById("pillClearBtn")?.addEventListener(
      "click",
      () => {
        setSelectedProjectFilter("all", { scroll: true });
      },
      { once: true },
    );
  }

  // -----------------------------
  // Skills
  // -----------------------------
  function renderSkills() {
    const DATA = getData();
    const wrap = $("#skillsGrid");
    const selected = selectedFilterRoles();

    const visibleSkills = (DATA.skills || []).filter((s) => {
      if (!selected) return true;
      return (s.roles || []).some((role) => selected.includes(role));
    });

    wrap.innerHTML = visibleSkills
      .map((s) => {
        const pills = (s.items || [])
          .map((it) => `<span class="${badgeClass()}">${escapeHtml(it)}</span>`)
          .join("");

        return `
          <div class="${cardClass()} ${
            selected
              ? "ring-2 ring-slate-900/10 dark:ring-slate-100/10"
              : ""
          }">
            <div class="flex items-center gap-2">
              <div class="inline-flex h-9 w-9 items-center justify-center rounded-2xl
                ${
                  selected
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                }">
                <i data-lucide="${selected ? "sparkles" : "tag"}" class="h-4 w-4"></i>
              </div>
              <p class="text-base font-semibold text-slate-950 dark:text-white">${escapeHtml(s.category)}</p>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">${pills}</div>
          </div>
        `;
      })
      .join("");

    refreshIcons();
  }

  // -----------------------------
  // Projects
  // -----------------------------
  function projectCard(project) {
    const DATA = getData();
    const ui = DATA.ui || {};
    const labels = ui.labels || {};
    const btns = ui.buttons || {};
    const pills = ui.pills || {};

    const isPrivate = !!project.isPrivate;

    const github = !isPrivate ? safeExternalLink(project.links?.github) : null;
    const live = !isPrivate ? safeExternalLink(project.links?.liveDemo) : null;
    const url = safeExternalLink(project.links?.url);

    const videoUrl = project.media?.videoUrl || null;
    const hasVideo = !!videoUrl;

    const images = project.media?.images || [];
    const hasImages = images.length > 0;

    const privacyPill = isPrivate
      ? `<span class="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
          ${escapeHtml(state.locale === "fa" ? "خصوصی" : "Private")}
        </span>`
      : "";

    const roles = (project.roles || [])
      .map(
        (key) =>
          `<span class="${badgeClass()}">${escapeHtml(roleNameByKey(key))}</span>`,
      )
      .join("");

    const stackBlock = (() => {
      if (isPrivate) return "";

      const tags = (project.tags || [])
        .slice(0, 6)
        .map((t) => `<span class="${badgeClass()}">${escapeHtml(t)}</span>`)
        .join("");

      const extra = Math.max(0, (project.tags || []).length - 6);
      const extraTags = extra
        ? `<span class="${badgeClass()}">+${extra}</span>`
        : "";

      if (!tags && !extraTags) return "";

      return `
        <div class="mt-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(labels.stack || "Stack")}</p>
          <div class="mt-2 flex flex-wrap gap-2">${tags}${extraTags}</div>
        </div>
      `;
    })();

    const actions = (() => {
      const parts = [];

      if (!isPrivate) {
        if (github)
          parts.push(
            `<a class="${buttonSecondaryClass()}" href="${escapeHtml(github)}" target="_blank" rel="noopener noreferrer">${iconMarkup("github", "h-4 w-4")} ${escapeHtml(btns.github || "GitHub")}</a>`,
          );
        if (live)
          parts.push(
            `<a class="${buttonSecondaryClass()}" href="${escapeHtml(live)}" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link" class="h-4 w-4"></i> ${escapeHtml(btns.liveDemo || "Live demo")}</a>`,
          );
      }

      if (url)
        parts.push(
          `<a class="${buttonWebsiteClass()}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"><i data-lucide="globe-2" class="h-4 w-4"></i> ${escapeHtml(btns.url || "URL")}</a>`,
        );

      if (hasImages)
        parts.push(
          `<button class="${buttonImagesClass()}" type="button" data-action="view-images" data-project-id="${escapeHtml(project.id)}"><i data-lucide="images" class="h-4 w-4"></i> ${escapeHtml(btns.viewImages || "View images")}</button>`,
        );

      if (hasVideo)
        parts.push(
          `<button class="${buttonVideoClass()}" type="button" data-action="watch-video" data-video-url="${escapeHtml(videoUrl)}"><i data-lucide="play" class="h-4 w-4"></i> ${escapeHtml(btns.watchVideo || "Watch video")}</button>`,
        );

      parts.push(
        `<button class="${buttonPrimaryClass()}" type="button" data-action="open-details" data-project-id="${escapeHtml(project.id)}"><i data-lucide="file-text" class="h-4 w-4"></i> ${escapeHtml(btns.details || "Details")}</button>`,
      );

      return `<div class="mt-4 flex flex-wrap gap-2">${parts.join("")}</div>`;
    })();

    const privateNote = isPrivate
      ? `<p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300"><span class="font-semibold">${escapeHtml(
          pills.detailsUponRequest || "Details available upon request.",
        )}</span></p>`
      : "";

    return `
      <article class="${cardClass()}">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="text-base font-semibold tracking-tight text-slate-950 dark:text-white">${escapeHtml(project.title)}</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">${escapeHtml(project.shortDescription)}</p>
          </div>
          ${privacyPill}
        </div>

        <div class="mt-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(labels.roles || "Roles")}</p>
          <div class="mt-2 flex flex-wrap gap-2">${roles}</div>
        </div>

        ${stackBlock}

        ${privateNote}
        ${actions}
      </article>
    `;
  }

  function renderProjects() {
    const DATA = getData();
    const grid = $("#projectsGrid");
    const empty = $("#projectsEmptyState");

    const items = orderProjectsForFilter(
      (DATA.projects || []).filter(matchesRole),
      filterByKey(state.selectedRole),
    );
    grid.innerHTML = items.map(projectCard).join("");

    // empty state localized
    const titleEl = empty?.querySelector("p.text-base.font-semibold");
    const hintEl = empty?.querySelector("p.text-sm");
    if (titleEl)
      titleEl.textContent =
        DATA.ui?.empty?.noProjectsTitle || "No projects match this role.";
    if (hintEl)
      hintEl.textContent =
        DATA.ui?.empty?.noProjectsHint ||
        "Clear the selection to view all projects.";

    empty.classList.toggle("hidden", items.length > 0);

    refreshIcons();
    mountHideMissingImages(grid);
  }

  // -----------------------------
  // Experience / Education
  // -----------------------------
  function renderExperience() {
    const DATA = getData();
    const wrap = $("#experienceList");

    wrap.innerHTML = (DATA.experience || [])
      .map((e, experienceIndex) => {
        const companyUrl = safeExternalLink(e.url);
        const companyName = companyUrl
          ? `<a class="inline-flex items-center gap-1 hover:text-cyan-700 dark:hover:text-cyan-300" href="${escapeHtml(companyUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(e.company)}<i data-lucide="external-link" class="h-3.5 w-3.5"></i></a>`
          : escapeHtml(e.company);
        const bullets = (e.bullets || [])
          .map(
            (b, index) =>
              `<li class="${index > 1 ? "hidden sm:flex" : "flex"} gap-2 leading-6" data-experience-extra="${index > 1 ? "1" : "0"}"><i data-lucide="check-circle-2" class="mt-1 h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300"></i><span>${escapeHtml(
                b,
              )}</span></li>`,
          )
          .join("");

        const moreButton =
          (e.bullets || []).length > 2
            ? `<button
                class="mt-3 text-sm font-semibold text-cyan-700 underline underline-offset-4 hover:text-cyan-900 dark:text-cyan-300 dark:hover:text-cyan-100 sm:hidden"
                type="button"
                data-action="toggle-experience"
                data-expanded="false"
                data-experience-index="${experienceIndex}"
                aria-expanded="false"
              >
                <span>${escapeHtml(DATA.ui?.buttons?.experienceMore || "Details")}</span>
              </button>`
            : "";

        return `
          <div class="${cardClass()}" data-experience-card="${experienceIndex}">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p class="text-base font-semibold text-slate-950 dark:text-white">${companyName}</p>
                <p class="mt-1 text-sm font-medium text-cyan-800 dark:text-cyan-200">${escapeHtml(e.role)}</p>
              </div>
              <div class="inline-flex w-fit self-start items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
                <i data-lucide="calendar" class="h-4 w-4 text-rose-500"></i>
                <span>${escapeHtml(e.dates)}</span>
              </div>
            </div>
            <ul class="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">${bullets}</ul>
            ${moreButton}
          </div>
        `;
      })
      .join("");

    refreshIcons();
  }

  function renderEducation() {
    const DATA = getData();
    const wrap = $("#educationList");

    wrap.innerHTML = (DATA.education || [])
      .map((ed) => {
        const details = (ed.details || [])
          .map(
            (d) =>
              `<li class="flex gap-2"><i data-lucide="check" class="mt-0.5 h-4 w-4 text-slate-500"></i><span>${escapeHtml(
                d,
              )}</span></li>`,
          )
          .join("");

        return `
          <div class="${cardClass()}">
            <p class="text-base font-semibold">${escapeHtml(ed.school)}</p>
            <p class="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">${escapeHtml(ed.degree)}</p>
            <div class="mt-2 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <i data-lucide="calendar" class="h-4 w-4 text-slate-500"></i>
              <span>${escapeHtml(ed.dates)}</span>
            </div>
            <ul class="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">${details}</ul>
          </div>
        `;
      })
      .join("");

    refreshIcons();
  }

  // -----------------------------
  // Modals
  // -----------------------------
  function openProjectDetails(project) {
    const DATA = getData();
    const ui = DATA.ui || {};
    const labels = ui.labels || {};
    const modalText = ui.modal || {};

    const isPrivate = !!project.isPrivate;

    const roles = (project.roles || [])
      .map(
        (key) =>
          `<span class="${badgeClass()}">${escapeHtml(roleNameByKey(key))}</span>`,
      )
      .join("");

    const stackBlock = (() => {
      if (isPrivate) return "";

      const tags = (project.tags || [])
        .map((t) => `<span class="${badgeClass()}">${escapeHtml(t)}</span>`)
        .join("");

      if (!tags) return "";

      return `
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(labels.stack || "Stack")}</p>
            <div class="mt-2 flex flex-wrap gap-2">${tags}</div>
          </div>
      `;
    })();

    const detailsBlock = (() => {
      if (isPrivate) return "";

      const details = (project.details || [])
        .map(
          (d) =>
            `<li class="flex gap-2 leading-6"><i data-lucide="chevron-right" class="mt-1 h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300"></i><span>${escapeHtml(
              d,
            )}</span></li>`,
        )
        .join("");

      if (!details) return "";

      return `
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(labels.notes || "Notes")}</p>
            <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">${details}</ul>
          </div>
      `;
    })();

    const privateShareBlock = (() => {
      if (!isPrivate) return "";

      const bullets = privateShareBullets(project)
        .map(
          (item) =>
            `<li class="flex gap-2 leading-6"><i data-lucide="check-circle-2" class="mt-1 h-4 w-4 shrink-0 text-cyan-700 dark:text-cyan-300"></i><span>${escapeHtml(item)}</span></li>`,
        )
        .join("");

      return `
          <div class="rounded-lg border border-cyan-100 bg-cyan-50/70 p-4 text-sm text-slate-700 dark:border-cyan-900/70 dark:bg-cyan-950/25 dark:text-slate-200">
            <p class="font-semibold text-slate-950 dark:text-white">${escapeHtml(
              labels.privateShare || (state.locale === "fa" ? "قابل نمایش" : "Shareable summary"),
            )}</p>
            <ul class="mt-3 space-y-2">${bullets}</ul>
          </div>
      `;
    })();

    const github = !isPrivate ? safeExternalLink(project.links?.github) : null;
    const live = !isPrivate ? safeExternalLink(project.links?.liveDemo) : null;
    const url = safeExternalLink(project.links?.url);

    const modalActions = (() => {
      const parts = [];
      if (!isPrivate) {
        if (github) {
          parts.push(
            `<a class="${buttonSecondaryClass()}" href="${escapeHtml(github)}" target="_blank" rel="noopener noreferrer">${iconMarkup("github", "h-4 w-4")} GitHub</a>`,
          );
        }
        if (live) {
          parts.push(
            `<a class="${buttonSecondaryClass()}" href="${escapeHtml(live)}" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link" class="h-4 w-4"></i> Live demo</a>`,
          );
        }
      }
      if (url) {
        parts.push(
          `<a class="${buttonWebsiteClass()}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"><i data-lucide="globe-2" class="h-4 w-4"></i> ${escapeHtml(ui.buttons?.url || "Website")}</a>`,
        );
      }
      return parts.length ? `<div class="flex flex-wrap gap-2">${parts.join("")}</div>` : "";
    })();

    openModal({
      kicker: modalText.projectDetails || "Project details",
      title: project.title,
      htmlBody: `
        <div class="space-y-5">
          <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">${escapeHtml(project.shortDescription)}</p>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(labels.roles || "Roles")}</p>
            <div class="mt-2 flex flex-wrap gap-2">${roles}</div>
          </div>

          ${stackBlock}
          ${detailsBlock}
          ${privateShareBlock}

          ${modalActions}
        </div>
      `,
    });
  }

  function openProjectImages(project) {
    const DATA = getData();
    const modalText = DATA.ui?.modal || {};
    const pills = DATA.ui?.pills || {};

    const images = project.media?.images || [];
    if (!images.length) return;

    if (project.isPrivate) {
      openModal({
        kicker: modalText.images || "Images",
        title: project.title,
        htmlBody: `
          <div class="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-900/45 dark:text-slate-300">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(
              state.locale === "fa" ? "پروژه خصوصی" : "Private project",
            )}</p>
            <p class="mt-2">${escapeHtml(pills.detailsUponRequest || "Details available upon request.")}</p>
          </div>
        `,
      });
      return;
    }

    openModal({
      kicker: modalText.images || "Images",
      title: project.title,
      htmlBody: `
        <div class="space-y-4">
          ${images
            .map(
              (src) => `
              <div class="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-950/30" data-img-container="1">
                <div class="flex items-center justify-center bg-slate-50 dark:bg-slate-900/40" style="min-height: 280px;">
                  <img
                    src="${escapeHtml(src)}"
                    alt="${escapeHtml(project.title)} image"
                    class="max-h-[70vh] w-auto max-w-full object-contain"
                    data-hide-on-error="1"
                  />
                </div>
              </div>
            `,
            )
            .join("")}
        </div>
      `,
    });

    setTimeout(() => mountHideMissingImages(modal.bodyEl), 0);
  }

  // -----------------------------
  // Events
  // -----------------------------
  function attachEvents() {
    // mobile menu
    const btn = $("#mobileMenuBtn");
    const menu = $("#mobileMenu");
    if (btn && menu) {
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
      showPage(routeFromHash(), { scrollTop: true, smooth: true });
    });

    document.getElementById("heroSummaryToggle")?.addEventListener("click", () => {
      state.heroExpanded = !state.heroExpanded;
      renderTop();
      refreshIcons();
    });

    // role filter chips
    $("#filters")?.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-chip-type='role']");
      if (!chip) return;
      const key = chip.getAttribute("data-chip-value");
      if (!key) return;

      setSelectedProjectFilter(key, { toggle: true, scroll: true });
    });

    $("#projectFilterSelect")?.addEventListener("change", (e) => {
      setSelectedProjectFilter(e.target.value, { scroll: true });
    });

    // project actions
    $("#projectsGrid")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;

      const action = btn.getAttribute("data-action");
      if (!action) return;

      // watch video -> open new tab
      if (action === "watch-video") {
        const rawUrl = btn.getAttribute("data-video-url");
        const url = safeExternalLink(rawUrl) || rawUrl; // allow ./mp4
        if (!url) return;
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }

      const id = btn.getAttribute("data-project-id");
      if (!id) return;

      const DATA = getData();
      const project = (DATA.projects || []).find((p) => p.id === id);
      if (!project) return;

      if (action === "open-details") openProjectDetails(project);
      if (action === "view-images") openProjectImages(project);
    });

    $("#experienceList")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action='toggle-experience']");
      if (!btn) return;

      const card = btn.closest("[data-experience-card]");
      if (!card) return;

      const expanded = btn.getAttribute("data-expanded") === "true";
      const nextExpanded = !expanded;
      const DATA = getData();
      const label = nextExpanded
        ? DATA.ui?.buttons?.experienceLess || "Hide responsibilities"
        : DATA.ui?.buttons?.experienceMore || "View responsibilities";

      card.querySelectorAll("[data-experience-extra='1']").forEach((item) => {
        item.classList.toggle("hidden", !nextExpanded);
        item.classList.toggle("flex", nextExpanded);
      });

      btn.setAttribute("data-expanded", nextExpanded ? "true" : "false");
      btn.setAttribute("aria-expanded", nextExpanded ? "true" : "false");
      const labelEl = btn.querySelector("span");
      if (labelEl) labelEl.textContent = label;
      refreshIcons();
    });
  }

  // -----------------------------
  // Init
  // -----------------------------
  function renderAll() {
    window.STATIC_PAGES?.render?.();
    renderStaticTexts();
    renderTop();
    renderChips();
    renderProjectFilterSelect();
    renderActiveRolePill();
    renderSkills();
    renderProjects();
    renderExperience();
    renderEducation();
    showPage(routeFromHash());
    refreshIcons();
  }

  function init() {
    initModal();
    applyTheme(getPreferredTheme());
    applyLocale(state.locale); // sets RTL/LTR and renders
    attachEvents();
    refreshIcons();
  }

  function animateProfileFrame() {
    const profileFrame = document.getElementById("profileFrame");
    if (!profileFrame) return;

    requestAnimationFrame(() =>
      profileFrame.classList.add("opacity-100", "translate-y-0"),
    );
  }

  function boot() {
    init();
    animateProfileFrame();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
