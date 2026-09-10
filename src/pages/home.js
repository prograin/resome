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
      stats: ["+۲۰ پروژه", "+۳ استارتاپ"],
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
      stats: ["+20 projects", "-3 startups"],
      cards: {
        resume: "Portfolio projects, skills, and work experience.",
        order: "Custom software design and development.",
        academy: "Python training from zero to real projects.",
      },
    },
  };

  copy.fa.contactPage = "تماس با ما";
  copy.fa.cards.contactPage =
    "پیام برای پروژه، آموزش، مشاوره یا همکاری.";
  copy.en.contactPage = "Contact us";
  copy.en.cards.contactPage =
    "Message me for projects, training, consulting, or collaboration.";

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
      <a href="${href}" data-page-link="${href.replace("#", "")}" dir="${dir}" class="group flex w-[92%] max-w-md items-center gap-4 rounded-lg border ${tones[tone]} bg-white/86 p-4 shadow-softer transition hover:bg-white dark:bg-slate-900/68 dark:hover:bg-slate-900 sm:w-[86%] sm:p-5 ${floatClass} ${position}">
        <span class="icon-tile ${iconTones[tone]}">${window.PAGE_SHARED.icon(iconName)}</span>
        <span class="min-w-0">
          <span class="block text-sm font-semibold text-slate-950 dark:text-white">${label}</span>
          <span class="mt-1 block text-base leading-6 text-slate-600 dark:text-slate-300">${text}</span>
        </span>
        <span class="home-card-cue">${window.PAGE_SHARED.icon("arrow-left", "h-4 w-4")}</span>
      </a>`;
  };

  window.PAGE_HOME = function renderHomePage(locale = "fa") {
    const t = copy[locale] || copy.fa;
    const dir = locale === "fa" ? "rtl" : "ltr";

    return `
      <div class="box-border min-h-[calc(100svh-4rem)] w-full overflow-x-hidden py-6 sm:h-[calc(100svh-4rem)] sm:min-h-0 sm:overflow-hidden sm:py-6" dir="${dir}">
        <section class="motion-rise mx-auto flex min-h-[calc(100svh-7rem)] w-full max-w-6xl min-w-0 flex-col justify-center gap-5 sm:grid sm:h-full sm:min-h-0 sm:items-center lg:grid-cols-[1fr_.95fr] lg:gap-10">
          <div class="min-w-0 text-center lg:text-start">
            <div class="home-stats mx-auto mb-3 flex w-fit flex-wrap items-center justify-center gap-2 lg:mx-0">
              ${t.stats.map((stat) => `<span>${stat}</span>`).join("")}
            </div>
            <h1 class="mx-auto w-[92%] max-w-md text-4xl font-semibold leading-tight tracking-normal text-cyan-950 dark:text-cyan-50 sm:w-auto sm:max-w-3xl sm:text-5xl lg:mx-0 lg:text-6xl">
              ${t.title}
            </h1>
            <p class="mx-auto mt-3 w-[92%] max-w-md break-words text-base leading-7 text-slate-700 dark:text-slate-300 sm:mt-5 sm:w-auto sm:max-w-2xl sm:leading-8 lg:mx-0">
              ${t.lead}
            </p>
          </div>

          <div class="relative w-full min-w-0 self-center">
            <nav class="relative flex w-full flex-col items-center justify-center gap-3 overflow-visible sm:min-h-[410px] sm:gap-5" dir="ltr" aria-label="Main sections">
              ${pathCard({ href: "#resume", label: t.resume, text: t.cards.resume, iconName: "user-round", tone: "cyan", position: "sm:self-start", floatClass: "float-card float-card-a", dir })}
              ${pathCard({ href: "#order", label: t.order, text: t.cards.order, iconName: "folder-kanban", tone: "emerald", position: "sm:self-end", floatClass: "float-card float-card-b", dir })}
              ${pathCard({ href: "#academy", label: t.academy, text: t.cards.academy, iconName: "graduation-cap", tone: "rose", position: "sm:self-start sm:ml-8", floatClass: "float-card float-card-c", dir })}
              ${pathCard({ href: "#contact-page", label: t.contactPage, text: t.cards.contactPage, iconName: "send", tone: "cyan", position: "sm:self-end sm:mr-8", floatClass: "float-card float-card-a", dir })}
            </nav>
          </div>
        </section>
      </div>`;
  };
})();
