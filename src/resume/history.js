// history behavior for the private portfolio.
export function createHistory(context) {
  const { getData, refreshIcons } = context;
  function renderExperience() {
    const DATA = getData();
    const wrap = context.$("#experienceList");

    wrap.innerHTML = (DATA.experience || [])
      .map((e, experienceIndex) => {
        const companyUrl = context.safeExternalLink(e.url);
        const companyName = companyUrl
          ? `<a class="inline-flex w-fit items-center gap-1.5 text-cyan-700 underline decoration-cyan-300/70 underline-offset-4 transition hover:text-cyan-900 hover:decoration-cyan-600 dark:text-cyan-300 dark:decoration-cyan-500/60 dark:hover:text-cyan-100 dark:hover:decoration-cyan-200" href="${context.escapeHtml(companyUrl)}" target="_blank" rel="noopener noreferrer">${context.escapeHtml(e.company)}<i data-lucide="external-link" class="h-3.5 w-3.5"></i></a>`
          : context.escapeHtml(e.company);
        const bullets = (e.bullets || [])
          .map(
            (b, index) =>
              `<li class="${index > 1 ? "hidden sm:flex" : "flex"} gap-2 leading-6" data-experience-extra="${index > 1 ? "1" : "0"}"><i data-lucide="check-circle-2" class="mt-1 h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300"></i><span>${context.escapeHtml(
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
                <span>${context.escapeHtml(DATA.ui?.buttons?.experienceMore || "Details")}</span>
              </button>`
            : "";

        return `
          <div class="${context.cardClass()}" data-experience-card="${experienceIndex}">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p class="text-base font-semibold text-slate-950 dark:text-white">${companyName}</p>
                <p class="mt-1 text-sm font-medium text-cyan-800 dark:text-cyan-200">${context.escapeHtml(e.role)}</p>
              </div>
              <div class="inline-flex w-fit self-start items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
                <i data-lucide="calendar" class="h-4 w-4 text-rose-500"></i>
                <span>${context.escapeHtml(e.dates)}</span>
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
    const wrap = context.$("#educationList");

    wrap.innerHTML = (DATA.education || [])
      .map((ed) => {
        const details = (ed.details || [])
          .map(
            (d) =>
              `<li class="flex gap-2"><i data-lucide="check" class="mt-0.5 h-4 w-4 text-slate-500"></i><span>${context.escapeHtml(
                d,
              )}</span></li>`,
          )
          .join("");

        return `
          <div class="${context.cardClass()}">
            <p class="text-base font-semibold">${context.escapeHtml(ed.school)}</p>
            <p class="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">${context.escapeHtml(ed.degree)}</p>
            <div class="mt-2 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <i data-lucide="calendar" class="h-4 w-4 text-slate-500"></i>
              <span>${context.escapeHtml(ed.dates)}</span>
            </div>
            <ul class="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">${details}</ul>
          </div>
        `;
      })
      .join("");

    refreshIcons();
  }

  return { renderExperience, renderEducation };
}
