// helpers behavior for the private portfolio.
export function createHelpers(context) {
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

  function iconMarkup(name, className = "h-4 w-4") {
    const svgClass = context.escapeHtml(className);

    if (name === "github") {
      return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="${svgClass}"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.426 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.699-2.782.605-3.369-1.343-3.369-1.343-.455-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.071 1.532 1.033 1.532 1.033.892 1.53 2.341 1.088 2.91.832.091-.647.349-1.088.635-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"/></svg>`;
    }

    if (name === "linkedin") {
      return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="${svgClass}"><path d="M6.94 8.5A1.56 1.56 0 1 1 6.94 5.38a1.56 1.56 0 0 1 0 3.12ZM5.5 9.75h2.88V19H5.5V9.75Zm4.69 0h2.76v1.26h.04c.38-.73 1.32-1.5 2.71-1.5 2.9 0 3.43 1.9 3.43 4.38V19h-2.88v-4.53c0-1.08-.02-2.47-1.5-2.47-1.51 0-1.74 1.18-1.74 2.39V19H10.2V9.75Z"/></svg>`;
    }

    if (name === "instagram") {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="${svgClass}"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>`;
    }

    return `<i data-lucide="${context.escapeHtml(name)}" class="${svgClass}"></i>`;
  }

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

  function mountHideMissingImages(root = document) {
    const imgs = Array.from(root.querySelectorAll("img[data-hide-on-error='1']"));
    for (const img of imgs) {
      img.addEventListener("error", () => {
        const container = img.closest("[data-img-container='1']");
        if (container) container.remove();
        else img.remove();
      });
    }
  }

  return {
    escapeHtml,
    uniq,
    safeExternalLink,
    iconMarkup,
    badgeClass,
    cardClass,
    buttonPrimaryClass,
    buttonSecondaryClass,
    buttonWebsiteClass,
    buttonImagesClass,
    buttonVideoClass,
    chipClass,
    mountHideMissingImages,
  };
}
