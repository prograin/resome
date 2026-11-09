// image gallery behavior for the private portfolio.
export function createImageGallery(context) {
  const { state, getData, modal, openModal } = context;
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
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${context.escapeHtml(
              state.locale === "fa" ? "پروژه خصوصی" : "Private project",
            )}</p>
            <p class="mt-2">${context.escapeHtml(pills.detailsUponRequest || "Details available upon request.")}</p>
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
                    src="${context.escapeHtml(window.SITE_ASSETS.url(src))}"
                    alt="${context.escapeHtml(project.title)} image"
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

    setTimeout(() => context.mountHideMissingImages(modal.bodyEl), 0);
  }

  return { openProjectImages };
}
