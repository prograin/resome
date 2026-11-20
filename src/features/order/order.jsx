"use client";

import { SiteLink as Link } from "../../components/site-link";
import fa from "../../content/order/fa.json";
import en from "../../content/order/en.json";
import faqs from "../../content/order/faq.json";
import { Faq } from "../../components/faq";
import { Icon } from "../../components/icon";
import { usePreferences } from "../../components/preferences";
import { PackageCard } from "./package-card";
import { Projects } from "./projects";

const tones = {
  cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200",
  emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  rose: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
  violet: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
};

export function Order() {
  const { locale, dir } = usePreferences();
  const copy = locale === "fa" ? fa : en;
  return (
    <div className="order-page" dir={dir}>
      <section className="order-content">
        <div className="order-intro">
          <div className="text-center lg:text-start">
            <p className="page-eyebrow">
              {locale === "fa" ? copy.kicker : "Design & development with prograin"}
            </p>
            <h1
              className={`text-3xl font-semibold text-slate-950 dark:text-white sm:text-5xl ${locale === "fa" ? "tracking-normal" : "tracking-tight"}`}
            >
              {copy.title}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base lg:mx-0">
              {copy.lead}
            </p>
            <div className="order-contact-cta mx-auto mt-5 flex w-full max-w-md lg:mx-0 lg:max-w-xs">
              <Link
                prefetch={false}
                href="/contact/"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
              >
                <Icon name="send" className="h-4 w-4" />
                {copy.contactPage}
              </Link>
            </div>
          </div>
          <div className="order-services" dir={dir}>
            {copy.cards.map(([icon, title, text, tone]) => (
              <div
                key={title}
                className="order-service rounded-lg border border-slate-200 bg-white/85 p-4 shadow-softer dark:border-slate-800 dark:bg-slate-900/55"
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone]}`}
                >
                  <Icon name={icon} />
                </span>
                <p className="mt-4 text-base font-semibold text-slate-950 dark:text-white sm:text-sm">
                  {title}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <Projects locale={locale} dir={dir} />
        <div className="pricing-panel" dir={dir}>
          <div className="pricing-panel__header">
            <div>
              <h2>{copy.pricingTitle}</h2>
            </div>
          </div>
          <div className="pricing-grid" data-pricing-grid>
            {copy.packages.map((plan, index) => (
              <PackageCard
                key={plan.title}
                plan={plan}
                index={index}
                locale={locale}
                dir={dir}
                detailsLabel={copy.showMore}
              />
            ))}
          </div>
        </div>
        <Faq
          dir={dir}
          items={faqs[locale]}
          title={locale === "fa" ? "پرسش‌های رایج درباره سفارش پروژه" : "Project questions"}
        />
      </section>
    </div>
  );
}
