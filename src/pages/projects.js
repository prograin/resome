// Public projects explicitly selected for the project-order page.
// Dr Bajelani and ParkPing assets come from their own published websites.
(() => {
  "use strict";

  const projects = [
    {
      name: { fa: "Black Wall", en: "Black Wall" },
      description: { fa: "وب‌سایت فروشگاهی", en: "E-commerce website" },
      href: "https://black-wall.org/",
      logo: "./assets/images/clients/black-wall.webp",
      tone: "gold",
    },
    {
      name: { fa: "Rokesh Mehdi", en: "Rokesh Mehdi" },
      description: { fa: "فروشگاه و مدیریت سفارش‌ها", en: "Online store and order management" },
      href: "https://rokesh-mehdi.ir/",
      logo: "./assets/images/clients/rokesh-mehdi.webp",
      tone: "mint",
    },
    {
      name: { fa: "دکتر باجلانی", en: "Dr Bajelani" },
      description: { fa: "برنامه غذایی و تمرینی", en: "Nutrition and training programs" },
      href: "https://drbajelani.ir/",
      logo: "./assets/images/clients/dr-bajelani.webp",
      tone: "green",
    },
    {
      name: { fa: "ParkPing", en: "ParkPing" },
      description: { fa: "پایش و پیشنهاد پارکینگ", en: "Parking monitoring and suggestions" },
      href: "https://parkping.site/",
      logo: "./assets/images/clients/parkping-icon.webp",
      tone: "rose",
    },
  ];

  window.PAGE_PROJECTS = (locale = "fa") => {
    const language = locale === "en" ? "en" : "fa";
    const { icon } = window.PAGE_SHARED;
    const title = language === "fa" ? "پروژه‌های من" : "My projects";
    const visit = language === "fa" ? "مشاهده سایت" : "Visit website";
    return `<section class="project-showcase" aria-labelledby="publicProjectsTitle">
      <header class="project-showcase__header">
        <span class="project-showcase__eyebrow">${icon("folder-kanban", "h-4 w-4")}${language === "fa" ? "نمونه‌کارها" : "Selected work"}</span>
        <h2 id="publicProjectsTitle">${title}</h2>
      </header>
      <div class="project-showcase__grid">
        ${projects.map((project) => `<a class="project-showcase__item" data-project-tone="${project.tone}" href="${project.href}" target="_blank" rel="noopener noreferrer" aria-label="${project.name[language]} — ${visit}">
          <span class="project-showcase__logo" aria-hidden="true"><img src="${project.logo}" alt="" width="80" height="80" loading="lazy" decoding="async" /></span>
          <h3 dir="auto">${project.name[language]}</h3>
          <p>${project.description[language]}</p>
          <span class="project-showcase__visit">${visit}${icon(language === "fa" ? "chevron-left" : "chevron-right", "h-4 w-4")}</span>
        </a>`).join("")}
      </div>
    </section>`;
  };
})();
