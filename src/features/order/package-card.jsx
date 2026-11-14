import { Icon } from "../../components/icon";
import { useDetailsDialog } from "../../components/details-dialog";

function Feature({ text, extra = false }) {
  return (
    <li className={extra ? "pricing-card__feature-extra" : undefined} hidden={extra || undefined}>
      <Icon name="check-circle-2" className="h-4 w-4" />
      <span>{text}</span>
    </li>
  );
}

export function PackageCard({ plan, index, locale, dir, detailsLabel }) {
  const { open } = useDetailsDialog();
  function showDetails() {
    open({
      kind: "package",
      kicker: locale === "fa" ? "امکانات کامل پکیج" : "Full package features",
      title: plan.title,
      content: (
        <div className="package-details">
          <p className="package-details__price">{plan.price}</p>
          <p className="package-details__fit">{plan.fit}</p>
          <ul className="package-details__features">
            {plan.features.map((text) => (
              <Feature key={text} text={text} />
            ))}
          </ul>
        </div>
      ),
    });
  }
  return (
    <article
      className={`pricing-card${plan.featured ? " is-active" : ""}`}
      data-pricing-card={index}
      data-tone={plan.tone || "cyan"}
      aria-label={plan.title}
    >
      <div className="pricing-card__top">
        <span className="pricing-card__icon">
          <Icon name={plan.icon} />
        </span>
        <span className="pricing-card__badge" aria-hidden="true">
          0{index + 1}
        </span>
      </div>
      <h3 className="pricing-card__title">{plan.title}</h3>
      <p className="pricing-card__price">{plan.price}</p>
      <p className="pricing-card__fit">{plan.fit}</p>
      <ul className="pricing-card__features">
        {plan.features.map((text, number) => (
          <Feature key={text} text={text} extra={number >= 6} />
        ))}
      </ul>
      {plan.features.length > 6 && (
        <button
          className="pricing-card__toggle"
          type="button"
          data-pricing-toggle
          aria-haspopup="dialog"
          aria-controls="modalDialog"
          onClick={showDetails}
        >
          <span>{detailsLabel}</span>
          <Icon name={dir === "rtl" ? "chevron-left" : "chevron-right"} className="h-4 w-4" />
        </button>
      )}
    </article>
  );
}
