// Shared helpers for static pages.
(() => {
  "use strict";

  const contact = {
    email: "ahmadreza.pcg1377@gmail.com",
    phone: "09914663783",
    telegram: "prograin_arr",
    linkedin: "https://www.linkedin.com/in/ahmadreza-rezaei-b60866304",
  };

  const icon = (name, className = "h-5 w-5") =>
    `<i data-lucide="${name}" class="${className}"></i>`;

  const cta = (href, label, iconName, tone = "cyan", attrs = "") => {
    const pageKeyByPath = {
      "/": "home",
      "/home": "home",
      "/order": "order",
      "/academy": "academy",
      "/contact": "contact-page",
    };
    const pageAttr = pageKeyByPath[href]
      ? `data-page-link="${pageKeyByPath[href]}"`
      : "";
    const tones = {
      cyan: "bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200",
      emerald:
        "bg-emerald-700 text-white hover:bg-emerald-800 dark:bg-emerald-300 dark:text-slate-950 dark:hover:bg-emerald-200",
      rose: "bg-rose-700 text-white hover:bg-rose-800 dark:bg-rose-300 dark:text-slate-950 dark:hover:bg-rose-200",
      ghost:
        "border border-slate-200 bg-white/90 text-slate-800 hover:border-cyan-200 hover:bg-cyan-50 dark:border-slate-800 dark:bg-slate-950/55 dark:text-slate-100 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/35",
    };
    return `<a class="inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 ${tones[tone]}" href="${href}" ${pageAttr} ${attrs}>
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

  const footerCopy = {
    fa: {
      title: "prograin",
      lead:
        "آموزش برنامه نویسی در اراک، آموزش پایتون خصوصی و نیمه‌خصوصی، طراحی پروژه اختصاصی، توسعه وب، بک‌اند، اتوماسیون و تحلیل داده.",
      location: "اراک، ایران",
      servicesTitle: "خدمات",
      contactTitle: "ارتباط",
      pagesTitle: "صفحات",
      services: [
        "سفارش پروژه برنامه‌نویسی",
        "آموزش برنامه نویسی اراک",
        "آموزش پایتون",
        "مشاوره و توسعه نرم‌افزار",
      ],
      pages: [
        { href: "/", label: "خانه" },
        { href: "/order", label: "سفارش پروژه" },
        { href: "/academy", label: "آکادمی" },
        { href: "/contact", label: "تماس با ما" },
      ],
      telegram: "تلگرام",
      phone: "تماس مستقیم",
      email: "ایمیل",
    },
    en: {
      title: "prograin",
      lead:
        "Python developer and instructor for custom software projects, web development, backend systems, automation, data work, and online private or semi-private training.",
      location: "Arak, Iran",
      servicesTitle: "Services",
      contactTitle: "Contact",
      pagesTitle: "Pages",
      services: [
        "Custom programming projects",
        "Python training",
        "Private and semi-private training",
        "Software consulting and development",
      ],
      pages: [
        { href: "/", label: "Home" },
        { href: "/order", label: "Order project" },
        { href: "/academy", label: "Academy" },
        { href: "/contact", label: "Contact" },
      ],
      telegram: "Telegram",
      phone: "Direct call",
      email: "Email",
    },
  };

  const footer = (locale = "fa") => {
    const t = footerCopy[locale] || footerCopy.fa;

    const pageLinks = t.pages
      .map((page) => {
        const key =
          page.href === "/"
            ? "home"
            : page.href === "/contact"
              ? "contact-page"
              : page.href.slice(1);
        return `<a href="${page.href}" data-page-link="${key}">${page.label}</a>`;
      })
      .join("");

    return `
      <div class="site-footer__inner" dir="${locale === "fa" ? "rtl" : "ltr"}" itemscope itemtype="https://schema.org/Person">
        <section class="site-footer__brand">
          <h2 itemprop="name">${t.title}</h2>
          <p itemprop="description">${t.lead}</p>
          <span class="site-footer__location" itemprop="address">${icon("map-pin", "h-4 w-4")}${t.location}</span>
        </section>

        <nav class="site-footer__group" aria-label="${t.pagesTitle}">
          <h3>${t.pagesTitle}</h3>
          <div>${pageLinks}</div>
        </nav>

        <section class="site-footer__group">
          <h3>${t.servicesTitle}</h3>
          <ul>
            ${t.services.map((service) => `<li itemprop="knowsAbout">${service}</li>`).join("")}
          </ul>
        </section>

        <address class="site-footer__group site-footer__contact">
          <h3>${t.contactTitle}</h3>
          <div class="site-footer__socials">
            <a href="https://t.me/${contact.telegram}" target="_blank" rel="noopener noreferrer" aria-label="${t.telegram}">${icon("telegram", "h-5 w-5")}</a>
            <a href="tel:${contact.phone}" itemprop="telephone" aria-label="${t.phone}">${icon("phone", "h-5 w-5")}</a>
            <a href="mailto:${contact.email}" itemprop="email" aria-label="${t.email}">${icon("mail", "h-5 w-5")}</a>
            <a href="${contact.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${icon("linkedin", "h-5 w-5")}</a>
          </div>
        </address>

      </div>`;
  };

  window.PAGE_SHARED = { contact, icon, cta, featureCard, footer };
})();
