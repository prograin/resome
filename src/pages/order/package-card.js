const packageCard = (pkg, index, t, icon, locale) => {
  const active = pkg.featured ? " is-active" : "";
  const visibleFeatureCount = 6;
  const hasMoreFeatures = pkg.features.length > visibleFeatureCount;
  const features = pkg.features
    .map((feature, featureIndex) => {
      const isExtra = featureIndex >= visibleFeatureCount;
      return `<li ${isExtra ? 'class="pricing-card__feature-extra" hidden' : ""}>${icon("check-circle-2", "h-4 w-4")}<span>${feature}</span></li>`;
    })
    .join("");

  return `<article class="pricing-card${active}" data-pricing-card="${index}" data-tone="${pkg.tone || "cyan"}" aria-label="${pkg.title}">
      <div class="pricing-card__top">
        <span class="pricing-card__icon">${icon(pkg.icon, "h-5 w-5")}</span>
        <span class="pricing-card__badge" aria-hidden="true">0${index + 1}</span>
      </div>
      <h3 class="pricing-card__title">${pkg.title}</h3>
      <p class="pricing-card__price">${pkg.price}</p>
      <p class="pricing-card__fit">${pkg.fit}</p>
      <ul class="pricing-card__features">
        ${features}
      </ul>
      ${
        hasMoreFeatures
          ? `<button class="pricing-card__toggle" type="button" data-pricing-toggle aria-haspopup="dialog" aria-controls="modalDialog">
              <span data-pricing-toggle-label>${t.showMore}</span>
              ${icon(locale === "fa" ? "chevron-left" : "chevron-right", "h-4 w-4")}
            </button>`
          : ""
      }
    </article>`;
};

export { packageCard };
