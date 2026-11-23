"use client";

import { SiteLink as Link } from "../../components/site-link";
import { Button } from "../../components/ui/button";
import { routes } from "../../config/site";
import * as Tabs from "@radix-ui/react-tabs";
import fa from "../../content/academy/fa.json";
import en from "../../content/academy/en.json";
import faqs from "../../content/academy/faq.json";
import { Faq } from "../../components/faq";
import { Icon } from "../../components/icon";
import { usePreferences } from "../../components/preferences";
import { AcademyHero } from "./academy-hero";
import { LearningPaths } from "./learning-paths";
import { PlanCard } from "./plan-card";
import { BackgroundSection } from "./background-section";

const keys = ["private", "group"];
const icons = { private: "sparkles", group: "graduation-cap" };

export function Academy() {
  const { locale, dir } = usePreferences();
  const copy = locale === "fa" ? fa : en;
  const plans = locale === "fa" ? [...copy.plans].reverse() : copy.plans;

  return (
    <Tabs.Root defaultValue="private" dir={dir} asChild>
      <div className="academy-page academy-consultation" dir={dir}>
        <AcademyHero locale={locale} title={copy.title} lead={copy.lead}>
          <Button as={Link} prefetch={false} variant="primary" href={routes["contact-page"].path}>
            {copy.support}
          </Button>
        </AcademyHero>
        <div className="academy-consultation__content">
          <LearningPaths locale={locale} dir={dir} />
          <BackgroundSection className="academy-picker" data-academy-plans>
            <p className="academy-picker__label">{copy.selectorTitle}</p>
            <Tabs.List className="academy-tabs" aria-label={copy.selectorTitle}>
              {keys.map((key) => (
                <Tabs.Trigger key={key} value={key} asChild>
                  <Button variant="soft" className="academy-tab" data-academy-tab={key}>
                    <Icon name={icons[key]} className="h-4 w-4" />
                    {copy.tabs[key]}
                  </Button>
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            <div className="academy-comparison" aria-label={copy.selectorTitle}>
              {plans.map((plan) => (
                <Tabs.Content key={plan.key} value={plan.key} forceMount asChild>
                  <PlanCard plan={plan} dir={dir} copy={copy} />
                </Tabs.Content>
              ))}
            </div>
          </BackgroundSection>
          <BackgroundSection className="academy-youtube-section">
            <div className="academy-youtube-card">
              <span className="academy-youtube-card__icon">
                <Icon name="youtube" />
                <span>YouTube</span>
              </span>
              <div>
                <h2>{copy.youtubeTitle}</h2>
                <p>{copy.youtubeLead}</p>
              </div>
              <Button
                as="a"
                variant="soft"
                href="https://www.youtube.com/@Prograin_ARR/playlists"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="external-link" className="h-4 w-4" />
                <span>{copy.youtubeCta}</span>
              </Button>
            </div>
          </BackgroundSection>
          <Faq
            className="academy-faq-section"
            dir={dir}
            items={faqs[locale]}
            title={
              locale === "fa"
                ? "پرسش‌های رایج درباره آموزش برنامه‌نویسی"
                : "Programming training questions"
            }
          />
        </div>
      </div>
    </Tabs.Root>
  );
}
