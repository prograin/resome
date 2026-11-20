"use client";

import { SiteLink as Link } from "../../components/site-link";
import { usePreferences } from "../../components/preferences";
import { Button } from "../../components/ui/button";
import { routes } from "../../config/site";
import fa from "../../content/academy/fa.json";
import en from "../../content/academy/en.json";
import { AcademyHero } from "./academy-hero";

export function AcademyEntry() {
  const { locale, dir } = usePreferences();
  const copy = locale === "fa" ? fa : en;
  return (
    <div className="academy-page academy-entry" dir={dir}>
      <AcademyHero locale={locale} title="Prograin Academy" lead={copy.entryLead}>
        <Button
          as={Link}
          prefetch={false}
          href={routes["academy-students"].path}
          variant="primary"
          className="academy-hero__students"
        >
          {copy.studentsPage}
        </Button>
        <Button
          as={Link}
          prefetch={false}
          href={routes["academy-consultation"].path}
          variant="primary"
        >
          {copy.consultationPage}
        </Button>
      </AcademyHero>
    </div>
  );
}
