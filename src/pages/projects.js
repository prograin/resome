// Public projects explicitly selected for the project-order page.
// Dr Bajelani and ParkPing assets come from their own published websites.
(() => {
  "use strict";

  const projects = [
    {
      name: { fa: "Black Wall", en: "Black Wall" },
      href: "https://black-wall.org/",
      logo: "./assets/images/clients/black-wall.webp",
      tone: "gold",
    },
    {
      name: { fa: "Rokesh Mehdi", en: "Rokesh Mehdi" },
      href: "https://rokesh-mehdi.ir/",
      logo: "./assets/images/clients/rokesh-mehdi.webp",
      tone: "mint",
    },
    {
      name: { fa: "دکتر باجلانی", en: "Dr Bajelani" },
      href: "https://drbajelani.ir/",
      logo: "./assets/images/clients/dr-bajelani.webp",
      tone: "green",
    },
    {
      name: { fa: "ParkPing", en: "ParkPing" },
      href: "https://parkping.site/",
      logo: "./assets/images/clients/parkping-icon.webp",
      tone: "rose",
    },
  ];

  window.PAGE_PROJECTS = (locale = "fa") => {
    const language = locale === "en" ? "en" : "fa";
    const { icon } = window.PAGE_SHARED;
    const title = language === "fa" ? "نمونه‌کارها" : "Selected work";
    const visit = language === "fa" ? "مشاهده سایت" : "Visit website";
    return `<section class="project-showcase" aria-labelledby="publicProjectsTitle">
      <header class="project-showcase__header">
        <h2 id="publicProjectsTitle" class="project-showcase__title">${icon("folder-kanban", "h-4 w-4")}${title}</h2>
      </header>
      <div class="project-showcase__grid">
        ${projects
          .map(
            (
              project,
            ) => `<a class="project-showcase__item" data-project-tone="${project.tone}" href="${project.href}" target="_blank" rel="noopener noreferrer" aria-label="${project.name[language]} — ${visit}">
          <span class="project-showcase__logo" aria-hidden="true"><img src="${window.SITE_ASSETS.url(project.logo)}" alt="" width="80" height="80" loading="lazy" decoding="async" /></span>
          <h3 dir="auto">${project.name[language]}</h3>
          <span class="project-showcase__visit">${visit}${icon(language === "fa" ? "chevron-left" : "chevron-right", "h-4 w-4")}</span>
        </a>`,
          )
          .join("")}
      </div>
    </section>`;
  };
})();
