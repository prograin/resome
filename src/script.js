// script.js (UPDATED: no placeholder text blocks on missing images)
(() => {
  "use strict";

  const DATA = window.PORTFOLIO_DATA;
  if (!DATA) {
    console.error(
      "PORTFOLIO_DATA not found. Ensure data.js is loaded before script.js.",
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

  function isYouTube(url) {
    const u = safeExternalLink(url);
    return !!u && /youtube\.com|youtu\.be/i.test(u);
  }

  function isVimeo(url) {
    const u = safeExternalLink(url);
    return !!u && /vimeo\.com/i.test(u);
  }

  function toEmbedUrl(url) {
    const u = safeExternalLink(url);
    if (!u) return null;

    if (isYouTube(u)) {
      try {
        const parsed = new URL(u);
        if (parsed.hostname.includes("youtu.be")) {
          const id = parsed.pathname.replace("/", "").trim();
          return id ? `https://www.youtube.com/embed/${id}` : null;
        }
        const id = parsed.searchParams.get("v");
        if (id) return `https://www.youtube.com/embed/${id}`;
        if (parsed.pathname.startsWith("/embed/")) return u;
      } catch {
        return null;
      }
    }

    if (isVimeo(u)) {
      try {
        const parsed = new URL(u);
        const parts = parsed.pathname.split("/").filter(Boolean);
        const id = parts[parts.length - 1];
        if (id && /^\d+$/.test(id))
          return `https://player.vimeo.com/video/${id}`;
      } catch {
        return null;
      }
    }

    return null;
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

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

  // -----------------------------
  // State
  // -----------------------------
  const state = { selectedRole: null };

  const ROLE_META = (DATA.roles || []).map((r) => ({
    name: r.name,
    icon: r.icon || "layers",
  }));
  const ALL_ROLES = uniq([
    ...ROLE_META.map((r) => r.name),
    ...(DATA.projects || []).flatMap((p) => p.roles || []),
  ]).sort((a, b) => a.localeCompare(b));

  function chipClass(active) {
    return [
      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition shadow-sm",
      active
        ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
        : "border-slate-200 bg-white/70 text-slate-800 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:hover:bg-slate-900/70",
    ].join(" ");
  }

  function matchesRole(project) {
    if (!state.selectedRole) return true;
    return (project.roles || []).includes(state.selectedRole);
  }

  function setRole(role) {
    state.selectedRole = role;
    renderChips();
    renderActiveRolePill();
    renderSkills();
    renderProjects();
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
        if (container)
          container.remove(); // remove whole media block
        else img.remove();
      });
    }
  }

  // -----------------------------
  // Top render
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

  function renderTop() {
    $("#navName").textContent = DATA.personal.name || "Portfolio";
    // $("#heroKicker").textContent = DATA.ui?.heroKicker || "Portfolio";
    $("#heroName").textContent = DATA.personal.name || "";
    $("#heroTitle").textContent = DATA.personal.title || "";
    $("#heroSummary").textContent = DATA.personal.about || "";
    // $("#aboutText").textContent = DATA.personal.about || "";

    $("#heroLocation").textContent = DATA.personal.location || "";
    // $("#heroTimezone").textContent = DATA.personal.timezone || "";
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

    $("#rolesHint").textContent =
      DATA.ui?.rolesHint || "Select a role to filter projects.";
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
        "Email",
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
  // Profile fallback
  // -----------------------------
  function mountProfileEnhancements() {
    const img = document.getElementById("profileImg");
    const frame = document.getElementById("profileFrame");
    if (!frame) return;

    if (img) {
      img.addEventListener("error", () => {
        img.remove();
        frame.classList.add("flex", "items-center", "justify-center");
        frame.innerHTML = `
          <div class="text-center p-6">
            <div class="mx-auto mb-2 h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <i data-lucide="user" class="h-5 w-5 text-slate-700 dark:text-slate-100"></i>
            </div>
            <p class="text-sm font-semibold">Profile photo</p>
            <p class="text-xs text-slate-600 dark:text-slate-300">Place image at<br/>./assets/profile.jpg</p>
          </div>
        `;
        refreshIcons();
      });
    }

    const mmSmall = window.matchMedia("(max-width: 640px)");
    const mmPortrait = window.matchMedia("(orientation: portrait)");

    const reveal = () => {
      const shouldAnimate = mmSmall.matches || mmPortrait.matches;
      if (!shouldAnimate) {
        frame.classList.remove("opacity-0", "translate-y-2");
        frame.classList.add("opacity-100", "translate-y-0");
        return;
      }

      frame.classList.add("opacity-0", "translate-y-2");
      frame.classList.remove("opacity-100", "translate-y-0");

      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (entries) => {
            for (const ent of entries) {
              if (ent.isIntersecting) {
                frame.classList.remove("opacity-0", "translate-y-2");
                frame.classList.add("opacity-100", "translate-y-0");
                io.disconnect();
              }
            }
          },
          { threshold: 0.25 },
        );
        io.observe(frame);
      } else {
        setTimeout(() => {
          frame.classList.remove("opacity-0", "translate-y-2");
          frame.classList.add("opacity-100", "translate-y-0");
        }, 250);
      }
    };

    reveal();
    mmSmall.addEventListener?.("change", reveal);
    mmPortrait.addEventListener?.("change", reveal);
    window.addEventListener("resize", reveal);
  }

  // -----------------------------
  // Render: quick filter chips
  // -----------------------------
  function renderChips() {
    const wrap = $("#roleChips");
    wrap.innerHTML = ALL_ROLES.map((r) => {
      const active = state.selectedRole === r;
      const meta = ROLE_META.find((x) => x.name === r);
      const icon = meta?.icon || "circle";
      return `<button type="button"
          class="${chipClass(active)}"
          data-chip-type="role"
          data-chip-value="${escapeHtml(r)}"
          aria-pressed="${active ? "true" : "false"}"
        >
          <i data-lucide="${active ? "check-circle-2" : icon}" class="h-4 w-4"></i>
          <span>${escapeHtml(r)}</span>
        </button>`;
    }).join("");
    refreshIcons();
  }

  function renderActiveRolePill() {
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
        <span>${escapeHtml(state.selectedRole)}</span>
        <button type="button"
          class="ml-1 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          aria-label="Clear role filter"
          id="pillClearBtn">
          <i data-lucide="x" class="h-3.5 w-3.5"></i>
        </button>
      </div>
    `;
    refreshIcons();
    document
      .getElementById("pillClearBtn")
      ?.addEventListener("click", () => setRole(null), { once: true });
  }

  // -----------------------------
  // Skills (highlight by role)
  // -----------------------------
  function renderSkills() {
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
  // Projects (remove media block if image missing)
  // -----------------------------
  // function projectPreviewMedia(project) {
  //   if (project.isPrivate) return "";

  //   const images = project.media?.images || [];
  //   if (!images.length) return "";

  //   const first = images[0];
  //   return `
  //     <div class="mt-4 overflow-hidden rounded-[2rem] border border-slate-200 bg-white/40 dark:border-slate-800 dark:bg-slate-950/20" data-img-container="1">
  //       <div class="aspect-[16/9] bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center">
  //         <img
  //           src="${escapeHtml(first)}"
  //           alt="${escapeHtml(project.title)} preview"
  //           class="max-h-full max-w-full object-contain"
  //           data-hide-on-error="1"
  //         />
  //       </div>
  //     </div>
  //   `;
  // }

  function projectCard(project) {
    const isPrivate = !!project.isPrivate;

    const github = !isPrivate ? safeExternalLink(project.links?.github) : null;
    const live = !isPrivate ? safeExternalLink(project.links?.liveDemo) : null;

    const videoUrl = project.media?.videoUrl || null;
    const hasVideo = !!videoUrl;

    const images = project.media?.images || [];
    const hasImages = images.length > 0;

    const privacyPill = isPrivate
      ? `<span class="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200">
          <i data-lucide="lock" class="h-3.5 w-3.5"></i> Private / NDA
        </span>`
      : "";

    const roles = (project.roles || [])
      .map((r) => `<span class="${badgeClass()}">${escapeHtml(r)}</span>`)
      .join("");
    const tags = (project.tags || [])
      .slice(0, 8)
      .map((t) => `<span class="${badgeClass()}">${escapeHtml(t)}</span>`)
      .join("");
    const extra = Math.max(0, (project.tags || []).length - 8);
    const extraTags = extra
      ? `<span class="${badgeClass()}">+${extra} more</span>`
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
            `<a class="${buttonSecondaryClass()}" href="${escapeHtml(
              github,
            )}" target="_blank" rel="noopener noreferrer"><i data-lucide="github" class="h-4 w-4"></i> GitHub</a>`,
          );
        if (live)
          parts.push(
            `<a class="${buttonSecondaryClass()}" href="${escapeHtml(
              live,
            )}" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link" class="h-4 w-4"></i> Live demo</a>`,
          );
      }

      if (hasImages)
        parts.push(
          `<button class="${buttonSecondaryClass()}" type="button" data-action="view-images" data-project-id="${escapeHtml(
            project.id,
          )}"><i data-lucide="images" class="h-4 w-4"></i> View images</button>`,
        );
      if (hasVideo)
        parts.push(
          `<button class="${buttonSecondaryClass()}" type="button" data-action="watch-video" data-project-id="${escapeHtml(
            project.id,
          )}"><i data-lucide="play" class="h-4 w-4"></i> Watch video</button>`,
        );

      parts.push(
        `<button class="${buttonPrimaryClass()}" type="button" data-action="open-details" data-project-id="${escapeHtml(
          project.id,
        )}"><i data-lucide="file-text" class="h-4 w-4"></i> Details</button>`,
      );

      return `<div class="mt-4 flex flex-wrap gap-2">${parts.join("")}</div>`;
    })();

    const privateNote = isPrivate
      ? `<p class="mt-4 text-sm text-slate-600 dark:text-slate-300"><span class="font-semibold">Details available upon request.</span></p>`
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
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Roles</p>
          <div class="mt-2 flex flex-wrap gap-2">${roles}</div>
        </div>

        <div class="mt-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Stack</p>
          <div class="mt-2 flex flex-wrap gap-2">${tags}${extraTags}</div>
        </div>

        <div class="mt-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Highlights</p>
          <ul class="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">${highlights}</ul>
        </div>

        
        ${privateNote}
        ${actions}
      </article>
    `;
  }

  function renderProjects() {
    const grid = $("#projectsGrid");
    const empty = $("#projectsEmptyState");
    const items = (DATA.projects || []).filter(matchesRole);
    grid.innerHTML = items.map(projectCard).join("");
    empty.classList.toggle("hidden", items.length > 0);
    refreshIcons();
    mountHideMissingImages(grid);
  }

  // -----------------------------
  // Experience / Education
  // -----------------------------
  function renderExperience() {
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
  // Modals: Details / Video / Images
  // -----------------------------
  function openProjectDetails(project) {
    const isPrivate = !!project.isPrivate;

    const roles = (project.roles || [])
      .map((r) => `<span class="${badgeClass()}">${escapeHtml(r)}</span>`)
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
      kicker: "Project details",
      title: project.title,
      htmlBody: `
        <div class="space-y-5">
          <p class="text-sm text-slate-600 dark:text-slate-300">${escapeHtml(project.shortDescription)}</p>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Roles</p>
            <div class="mt-2 flex flex-wrap gap-2">${roles}</div>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Stack</p>
            <div class="mt-2 flex flex-wrap gap-2">${tags}</div>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Highlights</p>
            <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">${highlights}</ul>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Notes</p>
            <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">${details}</ul>
          </div>

          ${
            isPrivate
              ? `<div class="rounded-[2rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
                   <div class="flex items-start gap-2">
                     <i data-lucide="lock" class="mt-0.5 h-4 w-4 text-slate-500"></i>
                     <div>
                       <p class="font-semibold">Private / NDA</p>
                       <p class="mt-1 text-slate-600 dark:text-slate-300">Details available upon request.</p>
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

  function openProjectVideo(project) {
    const url = project.media?.videoUrl;
    if (!url) return;

    if (project.isPrivate) {
      openModal({
        kicker: "Watch video",
        title: project.title,
        htmlBody: `
          <div class="rounded-[2rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
            <div class="flex items-start gap-2">
              <i data-lucide="lock" class="mt-0.5 h-4 w-4 text-slate-500"></i>
              <div>
                <p class="font-semibold">Private / NDA</p>
                <p class="mt-1 text-slate-600 dark:text-slate-300">Video is private. Available upon request.</p>
              </div>
            </div>
          </div>
        `,
      });
      return;
    }

    const embed = toEmbedUrl(url);
    const isDirectMp4 =
      /\.mp4(\?.*)?$/i.test(url) || url.startsWith("./") || url.startsWith("/");

    let body = "";
    if (embed) {
      body = `
        <div class="overflow-hidden rounded-[2rem] border border-slate-200 bg-black dark:border-slate-800">
          <div class="aspect-video">
            <iframe
              class="h-full w-full"
              src="${escapeHtml(embed)}"
              title="${escapeHtml(project.title)} video"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      `;
    } else if (isDirectMp4) {
      body = `
        <div class="overflow-hidden rounded-[2rem] border border-slate-200 bg-black dark:border-slate-800">
          <video class="h-full w-full" controls>
            <source src="${escapeHtml(url)}" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      `;
    } else {
      const safe = safeExternalLink(url);
      body = safe
        ? `<a class="${buttonSecondaryClass()}" href="${escapeHtml(
            safe,
          )}" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link" class="h-4 w-4"></i> Open video</a>`
        : "";
    }

    openModal({ kicker: "Watch video", title: project.title, htmlBody: body });
  }

  function openProjectImages(project) {
    const images = project.media?.images || [];
    if (!images.length) return;

    if (project.isPrivate) {
      openModal({
        kicker: "Images",
        title: project.title,
        htmlBody: `
          <div class="rounded-[2rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200">
            <div class="flex items-start gap-2">
              <i data-lucide="lock" class="mt-0.5 h-4 w-4 text-slate-500"></i>
              <div>
                <p class="font-semibold">Private / NDA</p>
                <p class="mt-1 text-slate-600 dark:text-slate-300">Images are private. Available upon request.</p>
              </div>
            </div>
          </div>
        `,
      });
      return;
    }

    openModal({
      kicker: "Images",
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

    $("#themeToggle")?.addEventListener("click", () => {
      const next = document.documentElement.classList.contains("dark")
        ? "light"
        : "dark";
      applyTheme(next);
    });

    // quick filter chips
    $("#filters")?.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-chip-type='role']");
      if (!chip) return;
      const value = chip.getAttribute("data-chip-value");
      if (!value) return;
      setRole(state.selectedRole === value ? null : value);
    });

    // clear button
    $("#clearRoleBtn")?.addEventListener("click", () => setRole(null));

    // project actions
    $("#projectsGrid")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;

      const action = btn.getAttribute("data-action");
      const id = btn.getAttribute("data-project-id");
      if (!action || !id) return;

      const project = (DATA.projects || []).find((p) => p.id === id);
      if (!project) return;

      if (action === "open-details") openProjectDetails(project);
      if (action === "watch-video") openProjectVideo(project);
      if (action === "view-images") openProjectImages(project);
    });
  }

  // -----------------------------
  // Init
  // -----------------------------
  function init() {
    initModal();
    applyTheme(getPreferredTheme());

    renderTop();
    mountProfileEnhancements();

    renderChips();
    renderActiveRolePill();
    renderSkills();
    renderProjects();

    renderExperience();
    renderEducation();

    attachEvents();
    refreshIcons();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
