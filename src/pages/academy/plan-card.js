import { copy } from "./content.js";

const planCard = (plan, icon, locale = "fa") => `
    <article class="academy-plan ${plan.featured ? "is-featured" : ""}" data-academy-plan="${plan.key}" data-tone="${plan.tone}">
      <div class="academy-plan__top">
        <span class="academy-plan__icon">${icon(plan.icon, "h-5 w-5")}</span>
        <span class="academy-plan__badge">${plan.badge}</span>
      </div>
      <h3>${plan.title}</h3>
      <p class="academy-plan__price">
        ${plan.price}
        ${plan.suffix ? `<span>${plan.suffix}</span>` : ""}
      </p>
      <p class="academy-plan__fit">${plan.fit}</p>
      <ul>
        ${plan.features.map((feature) => `<li>${icon("check-circle-2", "h-4 w-4")}<span>${feature}</span></li>`).join("")}
      </ul>
      <button class="academy-plan__details" type="button" data-academy-details="${plan.key}" aria-haspopup="dialog" aria-controls="modalDialog">
        <span>${(copy[locale] || copy.fa).detailsLabel}</span>
        ${icon(locale === "fa" ? "chevron-left" : "chevron-right", "h-4 w-4")}
      </button>
      <a class="academy-plan__cta" href="/contact" data-page-link="contact-page">${plan.cta}</a>
    </article>`;

export { planCard };
