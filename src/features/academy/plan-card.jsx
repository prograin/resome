import Link from "next/link";
import { Icon } from "../../components/icon";
import { useDetailsDialog } from "../../components/details-dialog";

export function PlanCard({ plan, active, copy, dir }) {
  const { open, close } = useDetailsDialog();
  const column = plan.key === "private" ? 2 : 1;
  function showDetails() {
    open({
      kind: "academy",
      kicker: copy.detailsTitle,
      title: plan.title,
      content: (
        <div className="academy-details" dir={dir}>
          <p className="package-details__price">
            {plan.price} <span>{plan.suffix}</span>
          </p>
          <dl className="academy-details__list">
            {copy.comparison.map((row) => (
              <div key={row[0]}>
                <dt>{row[0]}</dt>
                <dd>{row[column]}</dd>
              </div>
            ))}
          </dl>
          <Link prefetch={false} className="academy-plan__cta" href="/contact/" onClick={close}>
            {plan.cta}
          </Link>
        </div>
      ),
    });
  }
  return (
    <article
      id={`academy-plan-${plan.key}`}
      className={`academy-plan ${plan.featured ? "is-featured" : ""} ${active ? "is-active" : ""}`}
      data-academy-plan={plan.key}
      data-tone={plan.tone}
      aria-current={active}
    >
      <div className="academy-plan__top">
        <span className="academy-plan__icon">
          <Icon name={plan.icon} />
        </span>
        <span className="academy-plan__badge">{plan.badge}</span>
      </div>
      <h3>{plan.title}</h3>
      <p className="academy-plan__price">
        {plan.price} {plan.suffix && <span>{plan.suffix}</span>}
      </p>
      <p className="academy-plan__fit">{plan.fit}</p>
      <ul>
        {plan.features.map((feature) => (
          <li key={feature}>
            <Icon name="check-circle-2" className="h-4 w-4" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className="academy-plan__details"
        type="button"
        data-academy-details={plan.key}
        aria-haspopup="dialog"
        aria-controls="modalDialog"
        onClick={showDetails}
      >
        <span>{copy.detailsLabel}</span>
        <Icon name={dir === "rtl" ? "chevron-left" : "chevron-right"} className="h-4 w-4" />
      </button>
      <Link prefetch={false} className="academy-plan__cta" href="/contact/">
        {plan.cta}
      </Link>
    </article>
  );
}
