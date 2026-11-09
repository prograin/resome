// skills behavior for the private portfolio.
export function createSkills(context) {
  const { getData, refreshIcons } = context;
  function renderSkills() {
    const DATA = getData();
    const wrap = context.$("#skillsGrid");
    const selected = context.selectedFilterRoles();

    const visibleSkills = (DATA.skills || []).filter((s) => {
      if (!selected) return true;
      return (s.roles || []).some((role) => selected.includes(role));
    });

    wrap.innerHTML = visibleSkills
      .map((s) => {
        const pills = (s.items || [])
          .map((it) => `<span class="${context.badgeClass()}">${context.escapeHtml(it)}</span>`)
          .join("");

        return `
          <div class="${context.cardClass()} ${
            selected ? "ring-2 ring-slate-900/10 dark:ring-slate-100/10" : ""
          }">
            <div class="flex items-center gap-2">
              <div class="inline-flex h-9 w-9 items-center justify-center rounded-2xl
                ${
                  selected
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                }">
                <i data-lucide="${selected ? "sparkles" : "tag"}" class="h-4 w-4"></i>
              </div>
              <p class="text-base font-semibold text-slate-950 dark:text-white">${context.escapeHtml(s.category)}</p>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">${pills}</div>
          </div>
        `;
      })
      .join("");

    refreshIcons();
  }

  return { renderSkills };
}
