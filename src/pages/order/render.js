import faqs from "../../content/order/faq.json";
import { copy } from "./content.js";
import { orderCard } from "./service-card.js";
import { packageCard } from "./package-card.js";

export const renderOrderPage = function (locale = "fa") {
  const { icon, cta } = window.PAGE_SHARED;
  const t = copy[locale] || copy.fa;
  const dir = locale === "fa" ? "rtl" : "ltr";
  const titleClass = locale === "fa" ? "tracking-normal" : "tracking-tight";

  return `
      <div class="order-page" dir="${dir}">
        <section class="order-content">
          <div class="order-intro">
            <div class="text-center lg:text-start">
              <p class="page-eyebrow">${locale === "fa" ? t.kicker : "Design & development with prograin"}</p>
              <h1 class="text-3xl font-semibold text-slate-950 dark:text-white sm:text-5xl ${titleClass}">
                ${t.title}
              </h1>
              <p class="mx-auto mt-4 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base lg:mx-0">
                ${t.lead}
              </p>
              <div class="order-contact-cta mx-auto mt-5 flex w-full max-w-md lg:mx-0 lg:max-w-xs">
                ${cta("/contact", t.contactPage, "send", "cyan")}
              </div>
            </div>

            <div class="order-services" dir="${dir}">
              ${t.cards.map((card, index) => orderCard(card, index, icon)).join("")}
            </div>
          </div>

          ${window.PAGE_PROJECTS(locale)}

          <div class="pricing-panel" dir="${dir}">
            <div class="pricing-panel__header">
              <div>
                <h2>${t.pricingTitle}</h2>
              </div>
            </div>

            <div class="pricing-grid" data-pricing-grid>
              ${t.packages.map((pkg, index) => packageCard(pkg, index, t, icon, locale)).join("")}
            </div>

          </div>
          ${window.PAGE_SHARED.faq(locale === "fa" ? "پرسش‌های رایج درباره سفارش پروژه" : "Project questions", faqs[locale] || faqs.fa)}
        </section>
      </div>`;
};
