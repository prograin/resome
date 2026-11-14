"use client";

import Link from "next/link";
import fa from "../../content/home/fa.json";
import en from "../../content/home/en.json";
import { Icon } from "../../components/icon";
import { usePreferences } from "../../components/preferences";

const paths = [
  ["order", "/order/", "folder-kanban", "emerald"],
  ["academy", "/academy/", "graduation-cap", "rose"],
  ["contactPage", "/contact/", "send", "cyan"],
];

export function Home() {
  const { locale, dir } = usePreferences();
  const copy = locale === "fa" ? fa : en;
  return (
    <>
      <div className="home-layout" dir={dir}>
        <section className="home-hero">
          <div className="home-copy">
            <p className="home-eyebrow">{copy.eyebrow}</p>
            <div className="home-stats">
              {copy.stats.map((stat) => (
                <span key={stat}>
                  <bdi>{stat}</bdi>
                </span>
              ))}
            </div>
            <h1>{copy.title}</h1>
            <p className="home-lead">{copy.lead}</p>
          </div>
          <div className="home-paths">
            <nav aria-label={locale === "fa" ? "مسیرهای اصلی" : "Main sections"}>
              {paths.map(([key, href, icon, tone]) => (
                <Link
                  prefetch={false}
                  key={key}
                  href={href}
                  dir={dir}
                  className="home-path"
                  data-tone={tone}
                >
                  <span className="icon-tile">
                    <Icon name={icon} />
                  </span>
                  <span className="min-w-0">
                    <span className="block">{copy[key]}</span>
                    <span className="mt-1 block">{copy.cards[key]}</span>
                  </span>
                  <span className="home-card-cue">
                    <Icon
                      name={dir === "rtl" ? "chevron-left" : "chevron-right"}
                      className="h-4 w-4"
                    />
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </section>
      </div>
      <section className="home-details">
        <h2>{copy.introTitle}</h2>
        <p>{copy.intro}</p>
        <p>{copy.introClasses}</p>
        <p>{copy.introEnd}</p>
        <nav aria-label={copy.introTitle}>
          <Link prefetch={false} href="/academy/">
            {copy.introLinks.academy}
          </Link>
          <Link prefetch={false} href="/order/">
            {copy.introLinks.order}
          </Link>
          <Link prefetch={false} href="/contact/">
            {copy.introLinks.contact}
          </Link>
        </nav>
      </section>
    </>
  );
}
