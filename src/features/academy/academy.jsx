"use client";

import { SiteLink as Link } from "../../components/site-link";
import { Button } from "../../components/ui/button";
import { routes } from "../../config/site";
import { useEffect, useRef, useState } from "react";
import fa from "../../content/academy/fa.json";
import en from "../../content/academy/en.json";
import faqs from "../../content/academy/faq.json";
import { Faq } from "../../components/faq";
import { Icon } from "../../components/icon";
import { usePreferences } from "../../components/preferences";
import { AcademyHero } from "./academy-hero";
import { LearningPaths } from "./learning-paths";
import { PlanCard } from "./plan-card";

const keys = ["private", "group"];
const icons = { private: "sparkles", group: "graduation-cap" };

function BackgroundSection({ className, children, ...props }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      ref.current.classList.add("is-bg-ready");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: "300px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      className={`${className} ${ready ? "is-bg-ready" : ""}`}
      data-defer-background
      ref={ref}
      {...props}
    >
      {children}
    </section>
  );
}

export function Academy() {
  const { locale, dir } = usePreferences();
  const copy = locale === "fa" ? fa : en;
  const [active, setActive] = useState("private");
  const tabs = useRef([]);
  const plans = locale === "fa" ? [...copy.plans].reverse() : copy.plans;

  function handleTabKey(event, index) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home" ? 0 : event.key === "End" ? keys.length - 1 : (index + 1) % keys.length;
    setActive(keys[next]);
    tabs.current[next].focus();
  }

  return (
    <div className="academy-page academy-consultation" dir={dir} data-active-plan={active}>
      <AcademyHero locale={locale} title={copy.title} lead={copy.lead}>
        <Button as={Link} prefetch={false} variant="primary" href={routes["contact-page"].path}>
          {copy.support}
        </Button>
      </AcademyHero>
      <div className="academy-consultation__content">
        <LearningPaths locale={locale} dir={dir} />
        <BackgroundSection className="academy-picker" data-academy-plans>
          <p className="academy-picker__label">{copy.selectorTitle}</p>
          <div className="academy-tabs academy-neo" role="tablist" aria-label={copy.selectorTitle}>
            {keys.map((key, index) => (
              <Button
                variant="soft"
                key={key}
                ref={(element) => {
                  tabs.current[index] = element;
                }}
                className={`academy-tab ${active === key ? "is-active" : ""}`}
                type="button"
                role="tab"
                data-academy-tab={key}
                aria-selected={active === key}
                aria-controls={`academy-plan-${key}`}
                tabIndex={active === key ? 0 : -1}
                onClick={() => setActive(key)}
                onKeyDown={(event) => handleTabKey(event, index)}
              >
                <Icon name={icons[key]} className="h-4 w-4" />
                {copy.tabs[key]}
              </Button>
            ))}
          </div>
          <div className="academy-comparison" aria-label={copy.selectorTitle}>
            {plans.map((plan) => (
              <PlanCard
                key={plan.key}
                plan={plan}
                active={active === plan.key}
                dir={dir}
                copy={copy}
              />
            ))}
          </div>
        </BackgroundSection>
        <BackgroundSection className="academy-youtube-section">
          <div className="academy-youtube-card academy-neo">
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
  );
}
