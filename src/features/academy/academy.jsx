"use client";

import { useEffect, useRef, useState } from "react";
import fa from "../../content/academy/fa.json";
import en from "../../content/academy/en.json";
import faqs from "../../content/academy/faq.json";
import { Faq } from "../../components/faq";
import { Icon } from "../../components/icon";
import { usePreferences } from "../../components/preferences";
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
    <div className="academy-page" dir={dir} data-active-plan={active}>
      <section className="academy-hero">
        <div className="academy-hero__copy">
          <h1 className={locale === "fa" ? "tracking-normal" : "tracking-tight"}>{copy.title}</h1>
          <p>{copy.lead}</p>
        </div>
      </section>
      <BackgroundSection className="academy-picker" data-academy-plans>
        <p className="academy-picker__label">{copy.selectorTitle}</p>
        <div className="academy-tabs" role="tablist" aria-label={copy.selectorTitle}>
          {keys.map((key, index) => (
            <button
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
            </button>
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
        <div className="academy-youtube-card">
          <span className="academy-youtube-card__icon">
            <Icon name="youtube" />
            <span>YouTube</span>
          </span>
          <div>
            <h2>{copy.youtubeTitle}</h2>
            <p>{copy.youtubeLead}</p>
          </div>
          <a
            href="https://www.youtube.com/@Prograin_ARR/playlists"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="external-link" className="h-4 w-4" />
            <span>{copy.youtubeCta}</span>
          </a>
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
  );
}
