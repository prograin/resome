// Home page template.
(() => {
  "use strict";

  const copy = {
    fa: {
      title: "خوش آمدید",
      lead: "برای دیدن رزومه، سفارش پروژه یا ورود به آکادمی، روی کارت مربوطه کلیک کنید. برای مشاوره یا سوال هم از تلگرام یا ایمیل پیام بدهید.",
      resume: "مشاهده رزومه",
      order: "ثبت سفارش پروژه",
      academy: "ورود به آکادمی",
      telegram: "پیام در تلگرام",
      email: "ارسال ایمیل",
      phone: "تماس مستقیم",
      cards: {
        resume: "نمونه‌کارها، مهارت‌ها و سوابق کاری.",
        order: "طراحی و پیاده‌سازی پروژه اختصاصی.",
        academy: "آموزش پایتون از صفر تا انجام پروژه.",
      },
    },
    en: {
      title: "Welcome",
      lead: "Open the right card to view my resume, order a project, or enter the academy. For consultation or questions, message me on Telegram or email.",
      resume: "View resume",
      order: "Order a project",
      academy: "Enter academy",
      telegram: "Message on Telegram",
      email: "Send email",
      phone: "Direct call",
      cards: {
        resume: "Portfolio projects, skills, and work experience.",
        order: "Custom software design and development.",
        academy: "Python training from zero to real projects.",
      },
    },
  };

  const contactButton = ({ href, label, iconName, tone, attrs = "" }) => {
    const tones = {
      cyan: "bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200",
      emerald:
        "bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-300 dark:text-slate-950 dark:hover:bg-emerald-200",
      ghost:
        "border border-slate-200 bg-white/90 text-slate-800 hover:border-cyan-200 hover:bg-cyan-50 dark:border-slate-800 dark:bg-slate-950/55 dark:text-slate-100 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/35",
    };

    return `<a class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 ${tones[tone]}" href="${href}" ${attrs}>
      ${window.PAGE_SHARED.icon(iconName, "h-4 w-4")}
      ${label}
    </a>`;
  };

  const pathCard = ({ href, label, text, iconName, tone, position, floatClass, dir }) => {
    const tones = {
      cyan: "border-cyan-100 hover:border-cyan-300 dark:border-cyan-950 dark:hover:border-cyan-700",
      emerald:
        "border-emerald-100 hover:border-emerald-300 dark:border-emerald-950 dark:hover:border-emerald-700",
      rose: "border-rose-100 hover:border-rose-300 dark:border-rose-950 dark:hover:border-rose-700",
    };
    const iconTones = {
      cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",
      emerald:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
      rose: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
    };

    return `
      <a href="${href}" data-page-link="${href.replace("#", "")}" dir="${dir}" class="group flex w-full max-w-none items-center gap-4 rounded-lg border ${tones[tone]} bg-white/86 p-4 shadow-softer transition hover:bg-white dark:bg-slate-900/68 dark:hover:bg-slate-900 sm:w-[86%] sm:p-5 ${floatClass} ${position}">
        <span class="icon-tile ${iconTones[tone]}">${window.PAGE_SHARED.icon(iconName)}</span>
        <span class="min-w-0">
          <span class="block text-sm font-semibold text-slate-950 dark:text-white">${label}</span>
          <span class="mt-1 block text-base leading-6 text-slate-600 dark:text-slate-300">${text}</span>
        </span>
      </a>`;
  };

  window.PAGE_HOME = function renderHomePage(locale = "fa") {
    const { contact, cta } = window.PAGE_SHARED;
    const t = copy[locale] || copy.fa;
    const dir = locale === "fa" ? "rtl" : "ltr";

    return `
      <div class="box-border min-h-[calc(100svh-4rem)] w-full overflow-x-hidden py-6 sm:h-[calc(100svh-4rem)] sm:min-h-0 sm:overflow-hidden sm:py-6" dir="${dir}">
        <section class="motion-rise mx-auto flex min-h-[calc(100svh-7rem)] w-full max-w-6xl min-w-0 flex-col justify-center gap-5 sm:grid sm:h-full sm:min-h-0 sm:items-center lg:grid-cols-[1fr_.95fr] lg:gap-10">
          <div class="min-w-0 text-center lg:text-start">
            <h1 class="mx-auto w-[92%] max-w-md text-4xl font-semibold leading-tight tracking-normal text-cyan-950 dark:text-cyan-50 sm:w-auto sm:max-w-3xl sm:text-5xl lg:mx-0 lg:text-6xl">
              ${t.title}
            </h1>
            <p class="mx-auto mt-3 w-[92%] max-w-md break-words text-base leading-7 text-slate-700 dark:text-slate-300 sm:mt-5 sm:w-auto sm:max-w-2xl sm:leading-8 lg:mx-0">
              ${t.lead}
            </p>
            <div class="mt-7 hidden flex-wrap gap-3 sm:flex">
              ${cta(`https://t.me/${contact.telegram}`, t.telegram, "send", "cyan", 'target="_blank" rel="noopener noreferrer"')}
              ${cta(`tel:${contact.phone}`, t.phone, "phone", "emerald")}
              ${cta(`mailto:${contact.email}`, t.email, "mail", "ghost")}
            </div>
          </div>

          <div class="relative -mx-4 w-[calc(100%+2rem)] min-w-0 self-center sm:mx-0 sm:w-full">
            <nav class="relative flex w-full flex-col items-center justify-center gap-3 overflow-visible sm:min-h-[320px] sm:gap-6" dir="ltr" aria-label="Main sections">
              ${pathCard({ href: "#resume", label: t.resume, text: t.cards.resume, iconName: "user-round", tone: "cyan", position: "sm:self-start", floatClass: "float-card float-card-a", dir })}
              ${pathCard({ href: "#order", label: t.order, text: t.cards.order, iconName: "send", tone: "emerald", position: "sm:self-end", floatClass: "float-card float-card-b", dir })}
              ${pathCard({ href: "#academy", label: t.academy, text: t.cards.academy, iconName: "graduation-cap", tone: "rose", position: "sm:self-start sm:ml-8", floatClass: "float-card float-card-c", dir })}
            </nav>
            <div class="mx-auto mt-4 grid w-full max-w-none grid-cols-2 gap-3 sm:hidden">
              ${contactButton({ href: `https://t.me/${contact.telegram}`, label: t.telegram, iconName: "send", tone: "cyan", attrs: 'target="_blank" rel="noopener noreferrer"' })}
              ${contactButton({ href: `tel:${contact.phone}`, label: t.phone, iconName: "phone", tone: "emerald" })}
              ${contactButton({ href: `mailto:${contact.email}`, label: t.email, iconName: "mail", tone: "ghost" })}
            </div>
          </div>
        </section>
      </div>`;
  };
})();
