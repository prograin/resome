// filters behavior for the private portfolio.
export function createFilters(context) {
  const { state, getData, refreshIcons } = context;
  function setSelectedProjectFilter(key, options = {}) {
    const normalized = key && key !== "all" && context.filterByKey(key) ? key : null;
    state.selectedRole =
      options.toggle && normalized && state.selectedRole === normalized ? null : normalized;

    context.renderChips();
    context.renderProjectFilterSelect();
    context.renderActiveRolePill();
    context.renderSkills();
    context.renderProjects();

    if (options.scroll) {
      document.getElementById("projects")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function renderChips() {
    const DATA = getData();
    const wrap = context.$("#roleChips");
    const projects = DATA.projects || [];
    const filters = context.getProjectFilters();

    wrap.innerHTML = filters
      .map((filter) => {
        const key = filter.key;
        const active = (!state.selectedRole && key === "all") || state.selectedRole === key;
        const count = projects.filter((project) =>
          context.projectMatchesFilter(project, filter),
        ).length;
        const icon = active ? "check-circle-2" : filter.icon || "circle";
        const label = filter.name || key;
        const hint = filter.hint || "";

        return `<button type="button"
          class="${context.chipClass(active)}"
          data-chip-type="role"
          data-chip-value="${context.escapeHtml(key)}"
          aria-pressed="${active ? "true" : "false"}"
        >
          <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${active ? "bg-white/15 dark:bg-slate-900/10" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"}">
            <i data-lucide="${context.escapeHtml(icon)}" class="h-4 w-4"></i>
          </span>
          <span class="min-w-0">
            <span class="block leading-5">${context.escapeHtml(label)}</span>
            ${
              hint
                ? `<span class="mt-0.5 block text-xs font-medium leading-4 ${active ? "text-white/75 dark:text-slate-900/65" : "text-slate-500 dark:text-slate-400"}">${context.escapeHtml(hint)}</span>`
                : ""
            }
          </span>
          <span class="ms-auto inline-flex min-w-7 justify-center rounded-md border px-1.5 py-0.5 text-xs ${active ? "border-white/20 bg-white/10 dark:border-slate-900/10 dark:bg-slate-900/5" : "border-slate-200 bg-white/70 text-slate-500 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-400"}">${count}</span>
        </button>`;
      })
      .join("");

    refreshIcons();
  }

  function renderProjectFilterSelect() {
    const DATA = getData();
    const select = context.$("#projectFilterSelect");
    if (!select) return;

    const filters = context.getProjectFilters();
    const labelText =
      DATA.ui?.sections?.roles || (state.locale === "fa" ? "فیلتر پروژه‌ها" : "Project filter");

    select.setAttribute("aria-label", labelText);

    select.innerHTML = filters
      .map((filter) => {
        const label = filter.name || filter.key;
        return `<option value="${context.escapeHtml(filter.key)}">${context.escapeHtml(label)}</option>`;
      })
      .join("");

    select.value = state.selectedRole || "all";
  }

  function matchesRole(project) {
    return context.projectMatchesFilter(project, context.filterByKey(state.selectedRole));
  }

  function renderActiveRolePill() {
    const DATA = getData();
    const wrap = context.$("#activeRolePill");
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
        <span>${context.escapeHtml(context.filterNameByKey(state.selectedRole))}</span>
        <button type="button"
          class="ml-1 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          aria-label="${context.escapeHtml(DATA.ui?.buttons?.clearRole || "Clear")}"
          id="pillClearBtn">
          <i data-lucide="x" class="h-3.5 w-3.5"></i>
        </button>
      </div>
    `;
    refreshIcons();
    document.getElementById("pillClearBtn")?.addEventListener(
      "click",
      () => {
        context.setSelectedProjectFilter("all", { scroll: true });
      },
      { once: true },
    );
  }

  return {
    setSelectedProjectFilter,
    renderChips,
    renderProjectFilterSelect,
    matchesRole,
    renderActiveRolePill,
  };
}
