// Shared helpers for static pages.
(() => {
  "use strict";

  const contact = {
    email: "ahmadreza.pcg1377@gmail.com",
    phone: "+989185240247",
    telegram: "prograin_arr",
    linkedin: "https://www.linkedin.com/in/ahmadreza-rezaei-b60866304",
  };

  const icon = (name, className = "h-5 w-5") =>
    `<i data-lucide="${name}" class="${className}"></i>`;

  const cta = (href, label, iconName, tone = "cyan", attrs = "") => {
    const tones = {
      cyan: "bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200",
      emerald:
        "bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-300 dark:text-slate-950 dark:hover:bg-emerald-200",
      rose: "bg-rose-700 text-white hover:bg-rose-800 dark:bg-rose-300 dark:text-slate-950 dark:hover:bg-rose-200",
      ghost:
        "border border-slate-200 bg-white/90 text-slate-800 hover:border-cyan-200 hover:bg-cyan-50 dark:border-slate-800 dark:bg-slate-950/55 dark:text-slate-100 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/35",
    };
    return `<a class="inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 ${tones[tone]}" href="${href}" ${attrs}>
      ${icon(iconName, "h-4 w-4")}
      ${label}
    </a>`;
  };

  const featureCard = ({ iconName, title, text, tone = "cyan" }) => {
    const tones = {
      cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",
      emerald:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
      rose: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
      violet:
        "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
    };
    return `<div class="motion-rise rounded-lg border border-slate-200 bg-white/85 p-4 shadow-softer backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/55">
      <span class="inline-flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone]}">${icon(iconName)}</span>
      <p class="mt-4 text-sm font-semibold text-slate-950 dark:text-white">${title}</p>
      <p class="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">${text}</p>
    </div>`;
  };

  window.PAGE_SHARED = { contact, icon, cta, featureCard };
})();
