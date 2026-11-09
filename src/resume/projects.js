// projects behavior for the private portfolio.
export function createProjects(context) {
  const { state, getData, refreshIcons } = context;
  function renderProjects() {
    const DATA = getData();
    const grid = context.$("#projectsGrid");
    const empty = context.$("#projectsEmptyState");

    const items = context.orderProjectsForFilter(
      (DATA.projects || []).filter(context.matchesRole),
      context.filterByKey(state.selectedRole),
    );
    grid.innerHTML = items.map(context.projectCard).join("");

    // empty state localized
    const titleEl = empty?.querySelector("p.text-base.font-semibold");
    const hintEl = empty?.querySelector("p.text-sm");
    if (titleEl)
      titleEl.textContent = DATA.ui?.empty?.noProjectsTitle || "No projects match this role.";
    if (hintEl)
      hintEl.textContent =
        DATA.ui?.empty?.noProjectsHint || "Clear the selection to view all projects.";

    empty.classList.toggle("hidden", items.length > 0);

    refreshIcons();
    context.mountHideMissingImages(grid);
  }

  return { renderProjects };
}
