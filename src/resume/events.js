// events behavior for the private portfolio.
export function createEvents(context) {
  const { state, getData, refreshIcons } = context;
  function attachResumeEvents() {
    document.getElementById("heroSummaryToggle")?.addEventListener("click", () => {
      state.heroExpanded = !state.heroExpanded;
      context.renderTop();
      refreshIcons();
    });

    // role filter chips
    context.$("#filters")?.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-chip-type='role']");
      if (!chip) return;
      const key = chip.getAttribute("data-chip-value");
      if (!key) return;

      context.setSelectedProjectFilter(key, { toggle: true, scroll: true });
    });

    context.$("#projectFilterSelect")?.addEventListener("change", (e) => {
      context.setSelectedProjectFilter(e.target.value, { scroll: true });
    });

    // project actions
    context.$("#projectsGrid")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;

      const action = btn.getAttribute("data-action");
      if (!action) return;

      // watch video -> open new tab
      if (action === "watch-video") {
        const rawUrl = btn.getAttribute("data-video-url");
        const url = context.safeExternalLink(rawUrl) || rawUrl; // allow ./mp4
        if (!url) return;
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }

      const id = btn.getAttribute("data-project-id");
      if (!id) return;

      const DATA = getData();
      const project = (DATA.projects || []).find((p) => p.id === id);
      if (!project) return;

      if (action === "open-details") context.openProjectDetails(project);
      if (action === "view-images") context.openProjectImages(project);
    });

    context.$("#experienceList")?.addEventListener("click", (e) => {
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

  return { attachResumeEvents };
}
