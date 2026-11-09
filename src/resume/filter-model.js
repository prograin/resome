// filter model behavior for the private portfolio.
export function createFilterModel(context) {
  const { state, getData } = context;
  function roleNameByKey(key) {
    const d = getData();
    const r = (d.roles || []).find((x) => x.key === key);
    return r?.name || key;
  }

  function getProjectFilters() {
    const d = getData();
    const configured = d.ui?.projectFilters;
    if (Array.isArray(configured) && configured.length) return configured;

    return [
      {
        key: "all",
        name: state.locale === "fa" ? "همه" : "All work",
        hint: state.locale === "fa" ? "تمام نمونه‌کارها" : "Everything",
        icon: "layout-grid",
        roles: null,
      },
      ...(d.roles || []).map((role) => ({
        key: role.key,
        name: role.name,
        hint: role.blurb || "",
        icon: role.icon || "circle",
        roles: [role.key],
      })),
    ];
  }

  function filterByKey(key) {
    return context.getProjectFilters().find((filter) => filter.key === key) || null;
  }

  function selectedFilterRoles() {
    if (!state.selectedRole) return null;
    const roles = context.filterByKey(state.selectedRole)?.roles;
    return Array.isArray(roles) && roles.length ? roles : null;
  }

  function filterNameByKey(key) {
    return context.filterByKey(key)?.name || context.roleNameByKey(key);
  }

  function projectMatchesRoles(project, roles) {
    if (!roles || !roles.length) return true;
    return (project.roles || []).some((role) => roles.includes(role));
  }

  function projectMatchesFilter(project, filter) {
    if (!filter || filter.key === "all") return true;
    if (Array.isArray(filter.projectIds) && filter.projectIds.length) {
      return filter.projectIds.includes(project.id);
    }
    return context.projectMatchesRoles(project, filter.roles);
  }

  function orderProjectsForFilter(projects, filter) {
    if (!filter || !Array.isArray(filter.projectIds) || !filter.projectIds.length) {
      return projects;
    }
    const order = new Map(filter.projectIds.map((id, index) => [id, index]));
    return [...projects].sort(
      (a, b) =>
        (order.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.id) ?? Number.MAX_SAFE_INTEGER),
    );
  }

  return {
    roleNameByKey,
    getProjectFilters,
    filterByKey,
    selectedFilterRoles,
    filterNameByKey,
    projectMatchesRoles,
    projectMatchesFilter,
    orderProjectsForFilter,
  };
}
