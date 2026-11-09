// project details behavior for the private portfolio.
export function createProjectDetails(context) {
  const { state, getData, modal, openModal } = context;
  function openProjectDetails(project) {
    const DATA = getData();
    const ui = DATA.ui || {};
    const labels = ui.labels || {};
    const modalText = ui.modal || {};

    const isPrivate = !!project.isPrivate;

    const roles = (project.roles || [])
      .map(
        (key) =>
          `<span class="${context.badgeClass()}">${context.escapeHtml(context.roleNameByKey(key))}</span>`,
      )
      .join("");

    const stackBlock = (() => {
      if (isPrivate) return "";

      const tags = (project.tags || [])
        .map((t) => `<span class="${context.badgeClass()}">${context.escapeHtml(t)}</span>`)
        .join("");

      if (!tags) return "";

      return `
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${context.escapeHtml(labels.stack || "Stack")}</p>
            <div class="mt-2 flex flex-wrap gap-2">${tags}</div>
          </div>
      `;
    })();

    const detailsBlock = (() => {
      if (isPrivate) return "";

      const details = (project.details || [])
        .map(
          (d) =>
            `<li class="flex gap-2 leading-6"><i data-lucide="chevron-right" class="mt-1 h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300"></i><span>${context.escapeHtml(
              d,
            )}</span></li>`,
        )
        .join("");

      if (!details) return "";

      return `
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${context.escapeHtml(labels.notes || "Notes")}</p>
            <ul class="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200">${details}</ul>
          </div>
      `;
    })();

    const privateShareBlock = (() => {
      if (!isPrivate) return "";

      const bullets = context
        .privateShareBullets(project)
        .map(
          (item) =>
            `<li class="flex gap-2 leading-6"><i data-lucide="check-circle-2" class="mt-1 h-4 w-4 shrink-0 text-cyan-700 dark:text-cyan-300"></i><span>${context.escapeHtml(item)}</span></li>`,
        )
        .join("");

      return `
          <div class="rounded-lg border border-cyan-100 bg-cyan-50/70 p-4 text-sm text-slate-700 dark:border-cyan-900/70 dark:bg-cyan-950/25 dark:text-slate-200">
            <p class="font-semibold text-slate-950 dark:text-white">${context.escapeHtml(
              labels.privateShare || (state.locale === "fa" ? "قابل نمایش" : "Shareable summary"),
            )}</p>
            <ul class="mt-3 space-y-2">${bullets}</ul>
          </div>
      `;
    })();

    const github = !isPrivate ? context.safeExternalLink(project.links?.github) : null;
    const live = !isPrivate ? context.safeExternalLink(project.links?.liveDemo) : null;
    const url = context.safeExternalLink(project.links?.url);

    const modalActions = (() => {
      const parts = [];
      if (!isPrivate) {
        if (github) {
          parts.push(
            `<a class="${context.buttonSecondaryClass()}" href="${context.escapeHtml(github)}" target="_blank" rel="noopener noreferrer">${context.iconMarkup("github", "h-4 w-4")} GitHub</a>`,
          );
        }
        if (live) {
          parts.push(
            `<a class="${context.buttonSecondaryClass()}" href="${context.escapeHtml(live)}" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link" class="h-4 w-4"></i> Live demo</a>`,
          );
        }
      }
      if (url) {
        parts.push(
          `<a class="${context.buttonWebsiteClass()}" href="${context.escapeHtml(url)}" target="_blank" rel="noopener noreferrer"><i data-lucide="globe-2" class="h-4 w-4"></i> ${context.escapeHtml(ui.buttons?.url || "Website")}</a>`,
        );
      }
      return parts.length ? `<div class="flex flex-wrap gap-2">${parts.join("")}</div>` : "";
    })();

    openModal({
      kicker: modalText.projectDetails || "Project details",
      title: project.title,
      htmlBody: `
        <div class="space-y-5">
          <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">${context.escapeHtml(project.shortDescription)}</p>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${context.escapeHtml(labels.roles || "Roles")}</p>
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

  return { openProjectDetails };
}
