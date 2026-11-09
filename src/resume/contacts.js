// contacts behavior for the private portfolio.
export function createContacts(context) {
  const { state } = context;
  function linkPill(label, href, icon) {
    const pageKeyByPath = {
      "/": "home",
      "/home": "home",
      "/order": "order",
      "/academy": "academy",
      "/contact": "contact-page",
    };
    const url =
      context.safeExternalLink(href) ||
      (href &&
      (href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        href.startsWith("/"))
        ? href
        : null);
    const safeHref = url || "#";
    const disabled = safeHref === "#";
    const pageKey = pageKeyByPath[safeHref] || null;
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
      mail: "border-red-900/70 bg-red-950 text-white hover:bg-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-50 dark:hover:bg-red-900",
      phone:
        "border-emerald-200 bg-emerald-600 text-white hover:bg-emerald-700 dark:border-emerald-800 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300",
      send: "border-teal-200 bg-teal-600 text-white hover:bg-teal-700 dark:border-teal-800 dark:bg-teal-400 dark:text-slate-950 dark:hover:bg-teal-300",
    };

    const cls = disabled
      ? "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
      : activeByIcon[icon] ||
        "border-slate-200 bg-white/90 text-slate-800 hover:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-100 dark:hover:bg-slate-900/70";

    const iconHtml = context.iconMarkup(icon, "h-5 w-5 shrink-0");
    const labelHtml = `<span dir="${dir}">${context.escapeHtml(label)}</span>`;
    const content = isRtl ? `${labelHtml}${iconHtml}` : `${iconHtml}${labelHtml}`;

    return `<a class="inline-flex min-h-11 items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm font-semibold shadow-softer transition hover:-translate-y-0.5 ${cls}"
      dir="ltr"
      href="${context.escapeHtml(safeHref)}"
      ${pageKey ? `data-page-link="${pageKey}"` : ""}
      ${safeHref.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}
      aria-label="${context.escapeHtml(label)}">
      ${content}
    </a>`;
  }

  function contactCard(title, href, subtitle, icon) {
    const url =
      context.safeExternalLink(href) || (href && href.startsWith("mailto:") ? href : null);
    const safeHref = url || "#";
    const isRtl = state.locale === "fa";
    const dir = isRtl ? "rtl" : "ltr";
    const arrowIcon = isRtl ? "arrow-left" : "arrow-right";
    const arrowClass =
      "mt-1 shrink-0 text-slate-400 transition group-hover:text-slate-700 dark:group-hover:text-slate-200";
    const arrowMoveClass = isRtl ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5";
    const iconHtml = `<div class="mt-0.5 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200">
        ${context.iconMarkup(icon, "h-6 w-6")}
      </div>`;
    const textHtml = `<div class="min-w-0 flex-1 ${isRtl ? "text-right" : ""}" dir="${dir}">
        <p class="text-sm font-semibold text-slate-950 dark:text-white">${context.escapeHtml(title)}</p>
        <p class="mt-1 truncate text-xs text-slate-600 dark:text-slate-300">${context.escapeHtml(subtitle)}</p>
      </div>`;
    const arrowHtml = `<div class="${arrowClass} ${arrowMoveClass}">
        <i data-lucide="${arrowIcon}" class="h-4 w-4"></i>
      </div>`;
    const content = isRtl
      ? `${arrowHtml}${textHtml}${iconHtml}`
      : `${iconHtml}${textHtml}${arrowHtml}`;

    return `<a href="${context.escapeHtml(safeHref)}"
      class="group flex min-w-[220px] flex-1 items-start gap-3 rounded-lg border border-slate-200 bg-white/90 p-4 shadow-softer backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50/60 dark:border-slate-800 dark:bg-slate-950/45 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/25"
      dir="ltr"
      ${safeHref.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}
      aria-label="${context.escapeHtml(title)}"
    >
      ${content}
    </a>`;
  }

  return { linkPill, contactCard };
}
