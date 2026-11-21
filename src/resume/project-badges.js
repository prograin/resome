function badges(context, values) {
  return values
    .map((value) => `<span class="${context.badgeClass()}">${context.escapeHtml(value)}</span>`)
    .join("");
}

export function projectRoles(context, project) {
  return badges(
    context,
    (project.roles ?? []).map((key) => context.roleNameByKey(key)),
  );
}

export function projectStack(context, project, label, { limit = Infinity, spaced = false } = {}) {
  if (project.isPrivate) return "";
  const tags = project.tags ?? [];
  const visible = tags.slice(0, limit);
  const extra = tags.length - visible.length;
  const items = badges(context, visible) + (extra ? badges(context, [`+${extra}`]) : "");
  if (!items) return "";
  return `
    <div${spaced ? ' class="mt-4"' : ""}>
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${context.escapeHtml(label || "Stack")}</p>
      <div class="mt-2 flex flex-wrap gap-2">${items}</div>
    </div>
  `;
}
