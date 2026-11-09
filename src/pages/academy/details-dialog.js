import { copy } from "./content.js";

function initAcademyDetails(root) {
  root.querySelectorAll("[data-academy-details]").forEach((button) => {
    if (button.dataset.detailsReady === "true") return;
    button.dataset.detailsReady = "true";
    button.addEventListener("click", () => {
      const locale = document.documentElement.lang === "en" ? "en" : "fa";
      const t = copy[locale];
      const key = button.dataset.academyDetails;
      const plan = t.plans.find((item) => item.key === key);
      if (!plan) return;
      const valueIndex = key === "private" ? 2 : 1;
      window.SITE_MODAL?.open({
        kind: "academy",
        kicker: t.detailsTitle,
        title: plan.title,
        htmlBody: `<div class="academy-details" dir="${locale === "fa" ? "rtl" : "ltr"}">
            <p class="package-details__price">${plan.price} <span>${plan.suffix}</span></p>
            <dl class="academy-details__list">${t.comparison.map((row) => `<div><dt>${row[0]}</dt><dd>${row[valueIndex]}</dd></div>`).join("")}</dl>
            <a class="academy-plan__cta" href="/contact/" data-page-link="contact-page">${plan.cta}</a>
          </div>`,
      });
    });
  });
}

export { initAcademyDetails };
