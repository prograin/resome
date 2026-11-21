import { Button } from "../../components/ui/button";
import { SiteLink as Link } from "../../components/site-link";
import { Icon } from "../../components/icon";
import { useDetailsDialog } from "../../components/details-dialog";

export function PlanCard({ plan, copy, dir, ...props }) {
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
          <dl className="academy-details__list academy-inset">
            {copy.comparison.map((row) => (
              <div key={row[0]}>
                <dt>{row[0]}</dt>
                <dd>{row[column]}</dd>
              </div>
            ))}
          </dl>
          <Button
            as={Link}
            variant="primary"
            prefetch={false}
            className="academy-plan__cta"
            href="/contact/"
            onClick={close}
          >
            {plan.cta}
          </Button>
        </div>
      ),
    });
  }
  return (
    <article
      {...props}
      className={`academy-plan academy-neo ${plan.featured ? "is-featured" : ""}`}
      data-academy-plan={plan.key}
      data-tone={plan.tone}
    >
      <div className="academy-plan__top">
        <span className="academy-plan__icon academy-neo">
          <Icon name={plan.icon} />
        </span>
        <span className="academy-plan__badge academy-neo">{plan.badge}</span>
      </div>
      <h3>{plan.title}</h3>
      <p className="academy-plan__price">
        {plan.price} {plan.suffix && <span>{plan.suffix}</span>}
      </p>
      <p className="academy-plan__fit">{plan.fit}</p>
      <ul className="academy-inset">
        {plan.features.map((feature) => (
          <li key={feature}>
            <Icon name="check-circle-2" className="h-4 w-4" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        variant="soft"
        className="academy-plan__details"
        type="button"
        data-academy-details={plan.key}
        aria-haspopup="dialog"
        aria-controls="modalDialog"
        onClick={showDetails}
      >
        <span>{copy.detailsLabel}</span>
        <Icon name={dir === "rtl" ? "chevron-left" : "chevron-right"} className="h-4 w-4" />
      </Button>
      <Button
        as={Link}
        variant="primary"
        prefetch={false}
        className="academy-plan__cta"
        href="/contact/"
      >
        {plan.cta}
      </Button>
    </article>
  );
}
