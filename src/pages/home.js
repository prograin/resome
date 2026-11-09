import fa from "../content/home/fa.json";
import en from "../content/home/en.json";

// Home page template.
(() => {
  "use strict";

  const copy = { fa, en };

  const pathCard = ({ href, label, text, iconName, tone, dir }) => {
    const pageKeyByHref = {
      "/": "home",
      "/order": "order",
      "/academy": "academy",
      "/contact": "contact-page",
    };
    const iconTones = {
      cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",
      emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
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
        <p>${t.introClasses}</p>
        <p>${t.introEnd}</p>
        <nav aria-label="${t.introTitle}">
          <a href="/academy/" data-page-link="academy">${t.introLinks.academy}</a>
          <a href="/order/" data-page-link="order">${t.introLinks.order}</a>
          <a href="/contact/" data-page-link="contact-page">${t.introLinks.contact}</a>
        </nav>
      </section>`;
  };
})();
