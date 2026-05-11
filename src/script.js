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

  // -----------------------------
  // Theme
  // -----------------------------
  const THEME_KEY = "portfolio_theme";
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(THEME_KEY, theme);

    const icon = $("#themeToggle i");
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
    locale: localStorage.getItem(LOCALE_KEY) === "fa" ? "fa" : "en",
  };

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
    return "inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-2 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200";
  }
  function cardClass() {
    return "rounded-[2.5rem] border border-slate-200 bg-white/75 p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-md backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/55";
  }
  function buttonPrimaryClass() {
    return "inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white";
  }
  function buttonSecondaryClass() {
    return "inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-900/70";
  }

  function chipClass(active) {
    return [
      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition shadow-sm",
      active
        ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
        : "border-slate-200 bg-white/70 text-slate-800 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-900/70",
    ].join(" ");
  }

  // role display name from localized roles list
  function roleNameByKey(key) {
    const d = getData();
    const r = (d.roles || []).find((x) => x.key === key);
    return r?.name || key;
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

    const cls = disabled
      ? "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
      : "border-slate-200 bg-white/70 text-slate-800 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-900/70";

    return `<a class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold shadow-sm transition ${cls}"
      href="${escapeHtml(safeHref)}"
      ${safeHref.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}
      aria-label="${escapeHtml(label)}">
      <i data-lucide="${escapeHtml(icon)}" class="h-4 w-4"></i>
      <span>${escapeHtml(label)}</span>
    </a>`;
  }

  function contactCard(title, href, subtitle, icon) {
    const url =
      safeExternalLink(href) ||
      (href && href.startsWith("mailto:") ? href : null);
    const safeHref = url || "#";

    return `<a href="${escapeHtml(safeHref)}"
      class="group flex min-w-[220px] flex-1 items-start gap-3 rounded-[2rem] border border-slate-200 bg-white/75 p-4 shadow-softer backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-800 dark:bg-slate-950/35 dark:hover:bg-slate-900/65"
      ${safeHref.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}
      aria-label="${escapeHtml(title)}"
    >
      <div class="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50">
        <i data-lucide="${escapeHtml(icon)}" class="h-5 w-5"></i>
      </div>
      <div class="min-w-0">
        <p class="text-sm font-semibold">${escapeHtml(title)}</p>
        <p class="mt-1 truncate text-xs text-slate-600 dark:text-slate-300">${escapeHtml(subtitle)}</p>
      </div>
      <div class="ml-auto mt-1 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700 dark:group-hover:text-slate-200">
        <i data-lucide="arrow-right" class="h-4 w-4"></i>
      </div>
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

    setText("navRoles", nav.roles || "Roles");
    setText("navSkills", nav.skills || "Skills");
    setText("navProjects", nav.projects || "Projects");
    setText("navExperience", nav.experience || "Experience");
    setText("navEducation", nav.education || "Education");
    setText("navContact", nav.contact || "Contact");

    setText("mNavRoles", nav.roles || "Roles");
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
    $("#heroName").textContent = DATA.personal.name || "";
    $("#heroTitle").textContent = DATA.personal.title || "";
    $("#heroSummary").textContent = DATA.personal.about || "";

    $("#heroNumber").textContent = DATA.personal.number || "";
    $("#heroLocation").textContent = DATA.personal.location || "";

    const emailEl = $("#heroEmail");
    emailEl.textContent = DATA.personal.email || "";
    emailEl.href = DATA.personal.email ? `mailto:${DATA.personal.email}` : "#";

    const modesEl = document.getElementById("heroWorkModes");
    if (modesEl) {
      const type = DATA.personal.employmentType
        ? `${DATA.personal.employmentType}`
        : "";
      const modes = Array.isArray(DATA.personal.workModes)
        ? DATA.personal.workModes.join(" / ")
        : "";
      modesEl.textContent = [type, modes].filter(Boolean).join(" • ");
    }

    $("#rolesHint").textContent = DATA.ui?.rolesHint || "";
    $("#contactHint").textContent = DATA.ui?.contactHint || "";

    const cvBtn = $("#cvBtn");
    if (cvBtn) cvBtn.href = DATA.ui?.cvUrl || "#";

    $("#heroLinks").innerHTML = [
      linkPill("GitHub", DATA.personal.links?.github, "github"),
      linkPill("LinkedIn", DATA.personal.links?.linkedin, "linkedin"),
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
    ].join("");

    refreshIcons();
  }

  // -----------------------------
  // Roles chips
  // -----------------------------
  function renderChips() {
    const DATA = getData();
    const wrap = $("#roleChips");

    const ROLE_META = (DATA.roles || []).map((r) => ({
      key: r.key,
      name: r.name,
      icon: r.icon || "layers",
    }));

    // all role keys (from roles + projects roles)
    const ALL_ROLE_KEYS = uniq([
      ...ROLE_META.map((r) => r.key),
      ...(DATA.projects || []).flatMap((p) => p.roles || []),
    ]).sort((a, b) => a.localeCompare(b));

    wrap.innerHTML = ALL_ROLE_KEYS.map((key) => {
      const active = state.selectedRole === key;
      const meta = ROLE_META.find((x) => x.key === key);
      const icon = meta?.icon || "circle";
      const label = meta?.name || key;

      return `<button type="button"
          class="${chipClass(active)}"
          data-chip-type="role"
          data-chip-value="${escapeHtml(key)}"
          aria-pressed="${active ? "true" : "false"}"
        >
          <i data-lucide="${active ? "check-circle-2" : icon}" class="h-4 w-4"></i>
          <span>${escapeHtml(label)}</span>
        </button>`;
    }).join("");

    refreshIcons();
  }

  function matchesRole(project) {
    if (!state.selectedRole) return true;
    return (project.roles || []).includes(state.selectedRole);
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
        <span>${escapeHtml(roleNameByKey(state.selectedRole))}</span>
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
        state.selectedRole = null;
        renderChips();
        renderActiveRolePill();
        renderSkills();
        renderProjects();
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
    const selected = state.selectedRole;

    wrap.innerHTML = (DATA.skills || [])
      .map((s) => {
        const isRelevant = !selected
          ? true
          : (s.roles || []).includes(selected);
        const dim = selected && !isRelevant;

        const pills = (s.items || [])
          .map((it) => `<span class="${badgeClass()}">${escapeHtml(it)}</span>`)
          .join("");

        return `
          <div class="${cardClass()} ${dim ? "opacity-55" : ""} ${
            selected && isRelevant
              ? "ring-2 ring-slate-900/10 dark:ring-slate-100/10"
              : ""
          }">
            <div class="flex items-center gap-2">
              <div class="inline-flex h-9 w-9 items-center justify-center rounded-2xl
                ${
                  selected && isRelevant
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                }">
                <i data-lucide="${selected && isRelevant ? "sparkles" : "tag"}" class="h-4 w-4"></i>
              </div>
              <p class="text-base font-semibold">${escapeHtml(s.category)}</p>
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
      ? `<span class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200">
          <i data-lucide="lock" class="h-3.5 w-3.5"></i> ${escapeHtml(pills.privateNda || "Private / NDA")}
        </span>`
      : "";

    const roles = (project.roles || [])
      .map(
        (key) =>
          `<span class="${badgeClass()}">${escapeHtml(roleNameByKey(key))}</span>`,
      )
      .join("");

    const tags = (project.tags || [])
      .slice(0, 8)
      .map((t) => `<span class="${badgeClass()}">${escapeHtml(t)}</span>`)
      .join("");

    const extra = Math.max(0, (project.tags || []).length - 8);
    const extraTags = extra
      ? `<span class="${badgeClass()}">+${extra}</span>`
      : "";

    const highlights = (project.highlights || [])
      .slice(0, 4)
      .map(
        (h) =>
          `<li class="flex gap-2"><i data-lucide="check" class="mt-0.5 h-4 w-4 text-slate-500"></i><span>${escapeHtml(
            h,
          )}</span></li>`,
      )
      .join("");

    const actions = (() => {
      const parts = [];

      if (!isPrivate) {
        if (github)
          parts.push(
            `<a class="${buttonSecondaryClass()}" href="${escapeHtml(github)}" target="_blank" rel="noopener noreferrer"><i data-lucide="github" class="h-4 w-4"></i> ${escapeHtml(btns.github || "GitHub")}</a>`,
          );
        if (live)
          parts.push(
            `<a class="${buttonSecondaryClass()}" href="${escapeHtml(live)}" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link" class="h-4 w-4"></i> ${escapeHtml(btns.liveDemo || "Live demo")}</a>`,
          );
      }

      if (url)
        parts.push(
          `<a class="${buttonSecondaryClass()}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link" class="h-4 w-4"></i> ${escapeHtml(btns.url || "URL")}</a>`,
        );

      if (hasImages)
        parts.push(
          `<button class="${buttonSecondaryClass()}" type="button" data-action="view-images" data-project-id="${escapeHtml(project.id)}"><i data-lucide="images" class="h-4 w-4"></i> ${escapeHtml(btns.viewImages || "View images")}</button>`,
        );

      if (hasVideo)
        parts.push(
          `<button class="${buttonSecondaryClass()}" type="button" data-action="watch-video" data-video-url="${escapeHtml(videoUrl)}"><i data-lucide="play" class="h-4 w-4"></i> ${escapeHtml(btns.watchVideo || "Watch video")}</button>`,
        );

      parts.push(
        `<button class="${buttonPrimaryClass()}" type="button" data-action="open-details" data-project-id="${escapeHtml(project.id)}"><i data-lucide="file-text" class="h-4 w-4"></i> ${escapeHtml(btns.details || "Details")}</button>`,
      );

      return `<div class="mt-4 flex flex-wrap gap-2">${parts.join("")}</div>`;
    })();

    const privateNote = isPrivate
      ? `<p class="mt-4 text-sm text-slate-600 dark:text-slate-300"><span class="font-semibold">${escapeHtml(
          pills.detailsUponRequest || "Details available upon request.",
        )}</span></p>`
      : "";

    return `
      <article class="${cardClass()}">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="text-base font-semibold tracking-tight">${escapeHtml(project.title)}</h3>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${escapeHtml(project.shortDescription)}</p>
          </div>
          ${privacyPill}
        </div>

        <div class="mt-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(labels.roles || "Roles")}</p>
          <div class="mt-2 flex flex-wrap gap-2">${roles}</div>
        </div>

        <div class="mt-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(labels.stack || "Stack")}</p>
          <div class="mt-2 flex flex-wrap gap-2">${tags}${extraTags}</div>
        </div>

        <div class="mt-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(labels.highlights || "Highlights")}</p>
          <ul class="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">${highlights}</ul>
        </div>

        ${privateNote}
        ${actions}
      </article>
    `;
  }

  function renderProjects() {
    const DATA = getData();
    const grid = $("#projectsGrid");
    const empty = $("#projectsEmptyState");

    const items = (DATA.projects || []).filter(matchesRole);
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
      .map((e) => {
        const bullets = (e.bullets || [])
          .map(
            (b) =>
              `<li class="flex gap-2"><i data-lucide="dot" class="mt-1 h-4 w-4 text-slate-500"></i><span>${escapeHtml(
                b,
              )}</span></li>`,
          )
          .join("");

        return `
          <div class="${cardClass()}">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p class="text-base font-semibold">${escapeHtml(e.company)}</p>
                <p class="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">${escapeHtml(e.role)}</p>
              </div>
              <div class="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <i data-lucide="calendar" class="h-4 w-4 text-slate-500"></i>
                <span>${escapeHtml(e.dates)}</span>
              </div>
            </div>
            <ul class="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">${bullets}</ul>
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
    const pills = ui.pills || {};
    const modalText = ui.modal || {};

    const isPrivate = !!project.isPrivate;

    const roles = (project.roles || [])
      .map(
        (key) =>
          `<span class="${badgeClass()}">${escapeHtml(roleNameByKey(key))}</span>`,
      )
      .join("");

    const tags = (project.tags || [])
      .map((t) => `<span class="${badgeClass()}">${escapeHtml(t)}</span>`)
      .join("");

    const highlights = (project.highlights || [])
      .map(
        (h) =>
          `<li class="flex gap-2"><i data-lucide="check" class="mt-0.5 h-4 w-4 text-slate-500"></i><span>${escapeHtml(
            h,
          )}</span></li>`,
      )
      .join("");

    const details = (project.details || [])
      .map(
        (d) =>
          `<li class="flex gap-2"><i data-lucide="chevron-right" class="mt-0.5 h-4 w-4 text-slate-500"></i><span>${escapeHtml(
            d,
          )}</span></li>`,
      )
      .join("");

    const github = !isPrivate ? safeExternalLink(project.links?.github) : null;
    const live = !isPrivate ? safeExternalLink(project.links?.liveDemo) : null;

    openModal({
      kicker: modalText.projectDetails || "Project details",
      title: project.title,
      htmlBody: `
        <div class="space-y-5">
          <p class="text-sm text-slate-600 dark:text-slate-300">${escapeHtml(project.shortDescription)}</p>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(labels.roles || "Roles")}</p>
            <div class="mt-2 flex flex-wrap gap-2">${roles}</div>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(labels.stack || "Stack")}</p>
            <div class="mt-2 flex flex-wrap gap-2">${tags}</div>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(labels.highlights || "Highlights")}</p>
            <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">${highlights}</ul>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${escapeHtml(labels.notes || "Notes")}</p>
            <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">${details}</ul>
          </div>

          ${
            isPrivate
              ? `<div class="rounded-[2rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
                   <div class="flex items-start gap-2">
                     <i data-lucide="lock" class="mt-0.5 h-4 w-4 text-slate-500"></i>
                     <div>
                       <p class="font-semibold">${escapeHtml(pills.privateNda || "Private / NDA")}</p>
                       <p class="mt-1 text-slate-600 dark:text-slate-300">${escapeHtml(
                         pills.detailsUponRequest ||
                           "Details available upon request.",
                       )}</p>
                     </div>
                   </div>
                 </div>`
              : ""
          }

          ${
            !isPrivate
              ? `<div class="flex flex-wrap gap-2">
                  ${
                    github
                      ? `<a class="${buttonSecondaryClass()}" href="${escapeHtml(
                          github,
                        )}" target="_blank" rel="noopener noreferrer"><i data-lucide="github" class="h-4 w-4"></i> GitHub</a>`
                      : ""
                  }
                  ${
                    live
                      ? `<a class="${buttonSecondaryClass()}" href="${escapeHtml(
                          live,
                        )}" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link" class="h-4 w-4"></i> Live demo</a>`
                      : ""
                  }
                </div>`
              : ""
          }
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
          <div class="rounded-[2rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
            <div class="flex items-start gap-2">
              <i data-lucide="lock" class="mt-0.5 h-4 w-4 text-slate-500"></i>
              <div>
                <p class="font-semibold">${escapeHtml(pills.privateNda || "Private / NDA")}</p>
                <p class="mt-1 text-slate-600 dark:text-slate-300">${escapeHtml(pills.detailsUponRequest || "Details available upon request.")}</p>
              </div>
            </div>
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

    // role filter chips
    $("#filters")?.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-chip-type='role']");
      if (!chip) return;
      const key = chip.getAttribute("data-chip-value");
      if (!key) return;

      state.selectedRole = state.selectedRole === key ? null : key;
      renderChips();
      renderActiveRolePill();
      renderSkills();
      renderProjects();
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
  }

  // -----------------------------
  // Init
  // -----------------------------
  function renderAll() {
    renderStaticTexts();
    renderTop();
    renderChips();
    renderActiveRolePill();
    renderSkills();
    renderProjects();
    renderExperience();
    renderEducation();
    refreshIcons();
  }

  function init() {
    initModal();
    applyTheme(getPreferredTheme());
    applyLocale(state.locale); // sets RTL/LTR and renders
    attachEvents();
    refreshIcons();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  const pf = document.getElementById("profileFrame");
  if (pf)
    requestAnimationFrame(() =>
      pf.classList.add("opacity-100", "translate-y-0"),
    );
  else init();
})();
