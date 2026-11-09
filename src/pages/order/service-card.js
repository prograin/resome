const orderCard = ([iconName, title, text, tone], index, icon) => {
  const tones = {
    cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",
    emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
    rose: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
    violet: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  };
  return `<div class="order-service rounded-lg border border-slate-200 bg-white/85 p-4 shadow-softer dark:border-slate-800 dark:bg-slate-900/55">
      <span class="inline-flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone]}">${icon(iconName)}</span>
      <p class="mt-4 text-base font-semibold text-slate-950 dark:text-white sm:text-sm">${title}</p>
      <p class="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">${text}</p>
    </div>`;
};

export { orderCard };
