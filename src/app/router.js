import "../site-config.js";
import { state, getData, refreshIcons } from "./state.js";
import { modal, openModal, closeModal } from "./modal.js";

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
    if (!resumeUI)
      resumeUI = window.CREATE_RESUME_UI({ state, getData, refreshIcons, modal, openModal });
    resumeUI.render();
  }
  state.currentPage = nextPage;
  document.body.classList.toggle("page-home-active", nextPage === "home");
  document.body.classList.toggle("page-order-active", nextPage === "order");
  document.body.classList.toggle("page-academy-active", nextPage === "academy");
  document.body.classList.toggle("page-resume-active", nextPage === "resume");
  document.body.classList.toggle("page-contact-active", nextPage === "contact-page");

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
      window.PAGE_ACADEMY_INIT?.(document.getElementById("academyPage") || document);
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

export { PAGE_KEYS, routeFromPath, showPage, navigateToPage };
