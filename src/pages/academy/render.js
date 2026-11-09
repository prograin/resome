import { academyFaq } from "./faq-section.js";
import { copy } from "./content.js";
import { planCard } from "./plan-card.js";

export const renderAcademyPage = function (locale = "fa") {
  const { icon } = window.PAGE_SHARED;
  const t = copy[locale] || copy.fa;
  const dir = locale === "fa" ? "rtl" : "ltr";
  const titleClass = locale === "fa" ? "tracking-normal" : "tracking-tight";
  const displayPlans = locale === "fa" ? [t.plans[1], t.plans[0]] : [t.plans[0], t.plans[1]];

  return `
      <div class="academy-page" dir="${dir}" data-active-plan="private">
        <section class="academy-hero">
          <div class="academy-hero__copy">
            <h1 class="${titleClass}">${t.title}</h1>
            <p>${t.lead}</p>
          </div>
        </section>

        <section class="academy-picker" data-academy-plans data-defer-background>
          <p class="academy-picker__label">${t.selectorTitle}</p>
          <div class="academy-tabs" role="tablist" aria-label="${t.selectorTitle}">
            <button class="academy-tab is-active" type="button" role="tab" data-academy-tab="private" aria-selected="true">
              ${icon("sparkles", "h-4 w-4")}
              ${t.tabs.private}
            </button>
            <button class="academy-tab" type="button" role="tab" data-academy-tab="group" aria-selected="false">
              ${icon("graduation-cap", "h-4 w-4")}
              ${t.tabs.group}
            </button>
          </div>

          <div class="academy-comparison" aria-label="${t.selectorTitle}">
            ${displayPlans.map((plan) => planCard(plan, icon, locale)).join("")}
          </div>
        </section>

        <section class="academy-youtube-section" data-defer-background>
          <div class="academy-youtube-card">
            <span class="academy-youtube-card__icon">${icon("youtube", "h-5 w-5")}<span>YouTube</span></span>
            <div>
              <h2>${t.youtubeTitle}</h2>
              <p>${t.youtubeLead}</p>
            </div>
            <a href="https://www.youtube.com/@Prograin_ARR/playlists" target="_blank" rel="noopener noreferrer">
              ${icon("external-link", "h-4 w-4")}
              <span>${t.youtubeCta}</span>
            </a>
          </div>
        </section>
        ${academyFaq(locale)}
      </div>`;
};
