"use client";

import { contact, location } from "../../config/site";
import { Icon } from "../../components/icon";
import { usePreferences } from "../../components/preferences";
import { copy } from "./content";

export function Contact() {
  const { locale, dir } = usePreferences();
  const text = copy[locale];
  const actions = [
    ["telegram", "primary", `https://t.me/${contact.telegram}`, text.telegram, true],
    ["phone", "secondary", `tel:${contact.phone}`, text.phone],
    ["mail", "email", `mailto:${contact.email}`, text.email],
    ["linkedin", "linkedin", contact.linkedin, text.linkedin, true],
  ];
  return (
    <div className="contact-page" dir={dir}>
      <section className="contact-shell contact-shell--centered">
        <div className="contact-hero">
          <p className="contact-location">
            <Icon name="map-pin" className="h-4 w-4" />
            <bdi dir={dir}>{location.label[locale]}</bdi>
          </p>
          <h1 className={locale === "fa" ? "tracking-normal" : "tracking-tight"}>{text.title}</h1>
          <p>{text.lead}</p>
        </div>
        <div className="contact-link-grid">
          <div className="contact-actions">
            {actions.map(([icon, tone, href, label, external]) => (
              <a
                key={icon}
                className={`contact-action contact-action--${tone}`}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                <Icon name={icon} className="h-4 w-4" />
                <span>{label}</span>
                <span className="contact-action__cue">
                  <Icon
                    name={dir === "rtl" ? "chevron-left" : "chevron-right"}
                    className="h-4 w-4"
                  />
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="contact-final-stack">
          <span className="contact-final-stack__mark">
            <Icon name="lightbulb" className="h-12 w-12" />
          </span>
          <h2>{text.note}</h2>
          <p>{text.responseText}</p>
        </div>
      </section>
    </div>
  );
}
