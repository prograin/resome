// Home page template.
(() => {
  "use strict";

  const copy = {
    fa: {
      welcome: "خوش آمدید",
      title: "آموزش پایتون و برنامه‌نویسی در اراک",
      lead: "کلاس خصوصی پایتون، آموزش نیمه‌خصوصی و توسعه نرم‌افزار اختصاصی؛ مسیر یادگیری یا اجرای ایده‌تان را از اینجا شروع کنید.",
      introTitle: "آموزش و توسعه پروژه",
      intro: "من احمدرضا رضایی هستم؛ در شهر اراک، استان مرکزی فعالیت می‌کنم و در زمینه آموزش پایتون، طراحی سایت، توسعه بک‌اند و اتوماسیون پروژه انجام می‌دهم. کلاس خصوصی به‌صورت حضوری در اراک یا آنلاین و دوره نیمه‌خصوصی به‌صورت آنلاین برگزار می‌شود.",
      introEnd: "برای انتخاب کلاس، مقایسه خدمات توسعه یا مطرح‌کردن نیازتان، از مسیرهای زیر شروع کنید.",
      eyebrow: "توسعه نرم‌افزار · آموزش پایتون",
      order: "ثبت سفارش پروژه",
      academy: "ورود به آکادمی",
      telegram: "پیام در تلگرام",
      email: "ارسال ایمیل",
      phone: "تماس مستقیم",
      stats: ["+۲۰ پروژه", "+۳ استارتاپ"],
      cards: {
        order: "طراحی و پیاده‌سازی پروژه اختصاصی.",
        academy: "آموزش پایتون از صفر تا انجام پروژه.",
      },
    },
    en: {
      welcome: "Welcome",
      title: "Python training & software development",
      lead: "Private Python classes in Arak, semi-private online courses and custom software. Find the right path for your next step.",
      introTitle: "Learn and build with Ahmadreza Rezaei",
      intro: "I am Ahmadreza Rezaei, based in Arak, Markazi Province, Iran. I teach Python and develop websites, backend systems and automation. Private classes are available in person in Arak or online; semi-private courses are held online.",
      introEnd: "Explore the classes, compare development services or get in touch to discuss what you need.",
      eyebrow: "Software development · Python training",
      order: "Order a project",
      academy: "Enter academy",
      telegram: "Message on Telegram",
      email: "Send email",
      phone: "Direct call",
      stats: ["+20 projects", "+3 startups"],
      cards: {
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

  const pathCard = ({ href, label, text, iconName, tone, dir }) => {
    const pageKeyByHref = {
      "/": "home",
      "/order": "order",
      "/academy": "academy",
      "/contact": "contact-page",
    };
    const iconTones = {
      cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",
      emerald:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
      rose: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
    };

    return `
      <a href="${href}" data-page-link="${pageKeyByHref[href] || "home"}" dir="${dir}" class="home-path" data-tone="${tone}">
        <span class="icon-tile ${iconTones[tone]}">${window.PAGE_SHARED.icon(iconName)}</span>
        <span class="min-w-0">
          <span class="block text-sm font-semibold text-slate-950 dark:text-white">${label}</span>
          <span class="mt-1 block text-base leading-6 text-slate-600 dark:text-slate-300">${text}</span>
        </span>
        <span class="home-card-cue">${window.PAGE_SHARED.icon(dir === "rtl" ? "chevron-left" : "chevron-right", "h-4 w-4")}</span>
      </a>`;
  };

  window.PAGE_HOME = function renderHomePage(locale = "fa") {
    const t = copy[locale] || copy.fa;
    const dir = locale === "fa" ? "rtl" : "ltr";

    return `
      <div class="home-layout" dir="${dir}">
        <section class="home-hero">
          <div class="home-copy">
            <p class="home-eyebrow">${t.eyebrow}</p>
            <div class="home-stats">
              ${t.stats.map((stat) => `<span><bdi>${stat}</bdi></span>`).join("")}
            </div>
            <p class="home-welcome">${t.welcome}</p>
            <h1>
              ${t.title}
            </h1>
            <p class="home-lead">
              ${t.lead}
            </p>
          </div>

          <div class="home-paths">
            <nav aria-label="${locale === "fa" ? "مسیرهای اصلی" : "Main sections"}">
              ${pathCard({ href: "/order", label: t.order, text: t.cards.order, iconName: "folder-kanban", tone: "emerald", dir })}
              ${pathCard({ href: "/academy", label: t.academy, text: t.cards.academy, iconName: "graduation-cap", tone: "rose", dir })}
              ${pathCard({ href: "/contact", label: t.contactPage, text: t.cards.contactPage, iconName: "send", tone: "cyan", dir })}
            </nav>
          </div>
        </section>
      </div>
      <section class="home-details">
        <h2>${t.introTitle}</h2>
        <p>${t.intro}</p>
        <p>${t.introEnd}</p>
        <nav aria-label="${t.introTitle}">
          <a href="/academy/" data-page-link="academy">${locale === "fa" ? "کلاس‌های پایتون در اراک" : "Python classes in Arak"}</a>
          <a href="/order/" data-page-link="order">${locale === "fa" ? "خدمات و پکیج‌های توسعه پروژه" : "Project services and packages"}</a>
          <a href="/contact/" data-page-link="contact-page">${locale === "fa" ? "تماس با مدرس و توسعه‌دهنده" : "Contact the instructor and developer"}</a>
        </nav>
      </section>`;
  };
})();
