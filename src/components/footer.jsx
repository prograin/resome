"use client";

import Link from "next/link";
import fa from "../content/footer/fa.json";
import en from "../content/footer/en.json";
import { contact, location } from "../config/site";
import { Icon } from "./icon";
import { usePreferences } from "./preferences";

export function Footer() {
  const { locale, dir } = usePreferences();
  const copy = locale === "fa" ? fa : en;
  const channels = [
    ["telegram", `https://t.me/${contact.telegram}`, copy.telegram, true],
    ["phone", `tel:${contact.phone}`, copy.phone],
    ["mail", `mailto:${contact.email}`, copy.email],
    ["linkedin", contact.linkedin, "LinkedIn", true],
  ];
  return (
    <footer id="siteFooter" className="site-footer">
      <div className="site-footer__inner" dir={dir}>
        <section className="site-footer__brand">
          <h2>{copy.title}</h2>
          <p>{copy.lead}</p>
          <span className="site-footer__location">
            <Icon name="map-pin" className="h-4 w-4" />
            <bdi dir={dir}>{location.label[locale]}</bdi>
          </span>
        </section>
        <nav className="site-footer__group" aria-label={copy.pagesTitle}>
          <h3>{copy.pagesTitle}</h3>
          <div>
            {copy.pages.map(({ href, label }) => (
              <Link prefetch={false} key={href} href={href === "/" ? href : `${href}/`}>
                {label}
              </Link>
            ))}
          </div>
        </nav>
        <section className="site-footer__group">
          <h3>{copy.servicesTitle}</h3>
          <ul>
            {copy.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </section>
        <address className="site-footer__group site-footer__contact">
          <h3>{copy.contactTitle}</h3>
          <div className="site-footer__socials">
            {channels.map(([icon, href, label, external]) => (
              <a
                key={icon}
                href={href}
                aria-label={label}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                <Icon name={icon} />
              </a>
            ))}
          </div>
        </address>
      </div>
    </footer>
  );
}
