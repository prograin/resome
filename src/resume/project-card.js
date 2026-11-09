// project card behavior for the private portfolio.
export function createProjectCard(context) {
  const { state, getData } = context;
  function projectCard(project) {
    const DATA = getData();
    const ui = DATA.ui || {};
    const labels = ui.labels || {};
    const btns = ui.buttons || {};
    const pills = ui.pills || {};

    const isPrivate = !!project.isPrivate;

    const github = !isPrivate ? context.safeExternalLink(project.links?.github) : null;
    const live = !isPrivate ? context.safeExternalLink(project.links?.liveDemo) : null;
    const url = context.safeExternalLink(project.links?.url);

    const videoUrl = project.media?.videoUrl || null;
    const hasVideo = !!videoUrl;

    const images = project.media?.images || [];
    const hasImages = images.length > 0;

    const privacyPill = isPrivate
      ? `<span class="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
          ${context.escapeHtml(state.locale === "fa" ? "خصوصی" : "Private")}
        </span>`
      : "";

    const roles = (project.roles || [])
      .map(
        (key) =>
          `<span class="${context.badgeClass()}">${context.escapeHtml(context.roleNameByKey(key))}</span>`,
      )
      .join("");

    const stackBlock = (() => {
      if (isPrivate) return "";

      const tags = (project.tags || [])
        .slice(0, 6)
        .map((t) => `<span class="${context.badgeClass()}">${context.escapeHtml(t)}</span>`)
        .join("");

      const extra = Math.max(0, (project.tags || []).length - 6);
      const extraTags = extra ? `<span class="${context.badgeClass()}">+${extra}</span>` : "";

      if (!tags && !extraTags) return "";

      return `
        <div class="mt-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${context.escapeHtml(labels.stack || "Stack")}</p>
          <div class="mt-2 flex flex-wrap gap-2">${tags}${extraTags}</div>
        </div>
      `;
    })();

    const actions = (() => {
      const parts = [];

      if (!isPrivate) {
        if (github)
          parts.push(
            `<a class="${context.buttonSecondaryClass()}" href="${context.escapeHtml(github)}" target="_blank" rel="noopener noreferrer">${context.iconMarkup("github", "h-4 w-4")} ${context.escapeHtml(btns.github || "GitHub")}</a>`,
          );
        if (live)
          parts.push(
            `<a class="${context.buttonSecondaryClass()}" href="${context.escapeHtml(live)}" target="_blank" rel="noopener noreferrer"><i data-lucide="external-link" class="h-4 w-4"></i> ${context.escapeHtml(btns.liveDemo || "Live demo")}</a>`,
          );
      }

      if (url)
        parts.push(
          `<a class="${context.buttonWebsiteClass()}" href="${context.escapeHtml(url)}" target="_blank" rel="noopener noreferrer"><i data-lucide="globe-2" class="h-4 w-4"></i> ${context.escapeHtml(btns.url || "URL")}</a>`,
        );

      if (hasImages)
        parts.push(
          `<button class="${context.buttonImagesClass()}" type="button" data-action="view-images" data-project-id="${context.escapeHtml(project.id)}"><i data-lucide="images" class="h-4 w-4"></i> ${context.escapeHtml(btns.viewImages || "View images")}</button>`,
        );

      if (hasVideo)
        parts.push(
          `<button class="${context.buttonVideoClass()}" type="button" data-action="watch-video" data-video-url="${context.escapeHtml(videoUrl)}"><i data-lucide="play" class="h-4 w-4"></i> ${context.escapeHtml(btns.watchVideo || "Watch video")}</button>`,
        );

      parts.push(
        `<button class="${context.buttonPrimaryClass()}" type="button" data-action="open-details" data-project-id="${context.escapeHtml(project.id)}"><i data-lucide="file-text" class="h-4 w-4"></i> ${context.escapeHtml(btns.details || "Details")}</button>`,
      );

      return `<div class="mt-4 flex flex-wrap gap-2">${parts.join("")}</div>`;
    })();

    const privateNote = isPrivate
      ? `<p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300"><span class="font-semibold">${context.escapeHtml(
          pills.detailsUponRequest || "Details available upon request.",
        )}</span></p>`
      : "";
    const projectTitle = url
      ? `<a class="inline-flex w-fit text-cyan-700 underline decoration-cyan-300/70 underline-offset-4 transition hover:text-cyan-900 hover:decoration-cyan-600 dark:text-cyan-300 dark:decoration-cyan-500/60 dark:hover:text-cyan-100 dark:hover:decoration-cyan-200" href="${context.escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${context.escapeHtml(project.title)}</a>`
      : context.escapeHtml(project.title);

    return `
      <article class="${context.cardClass()}">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="text-base font-semibold tracking-tight text-slate-950 dark:text-white">${projectTitle}</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">${context.escapeHtml(project.shortDescription)}</p>
          </div>
          ${privacyPill}
        </div>

        <div class="mt-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${context.escapeHtml(labels.roles || "Roles")}</p>
          <div class="mt-2 flex flex-wrap gap-2">${roles}</div>
        </div>

        ${stackBlock}

        ${privateNote}
        ${actions}
      </article>
    `;
  }

  return { projectCard };
}
