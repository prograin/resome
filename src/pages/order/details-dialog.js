import { copy } from "./content.js";

function initPricing(root = document) {
  root.querySelectorAll("[data-pricing-grid]").forEach((grid) => {
    if (grid.dataset.pricingReady === "true") return;
    grid.dataset.pricingReady = "true";
    grid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-pricing-toggle]");
      if (!button) return;

      const card = button.closest("[data-pricing-card]");
      if (!card) return;

      const panelLocale = document.documentElement.getAttribute("lang") === "fa" ? "fa" : "en";
      const labels = copy[panelLocale] || copy.fa;
      const pkg = labels.packages[Number(card.dataset.pricingCard)];
      if (!pkg) return;
      window.SITE_MODAL.open({
        kind: "package",
        kicker: panelLocale === "fa" ? "امکانات کامل پکیج" : "Full package features",
        title: pkg.title,
        htmlBody: `<div class="package-details">
            <p class="package-details__price">${pkg.price}</p>
            <p class="package-details__fit">${pkg.fit}</p>
            <ul class="package-details__features">${pkg.features.map((feature) => `<li>${window.PAGE_SHARED.icon("check-circle-2", "h-4 w-4")}<span>${feature}</span></li>`).join("")}</ul>
          </div>`,
      });
    });
  });
}

export { initPricing };
