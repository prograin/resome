"use client";

import { useEffect } from "react";
import { usePreferences } from "./preferences";

export function PageMetadataSync({ copy }) {
  const { locale } = usePreferences();
  useEffect(() => {
    const seo = copy[locale] || copy.fa;
    document.title = seo.title;
    const fields = {
      'meta[name="description"]': seo.description,
      'meta[property="og:title"]': seo.title,
      'meta[property="og:description"]': seo.description,
      'meta[property="og:locale"]': seo.locale,
      'meta[name="twitter:title"]': seo.title,
      'meta[name="twitter:description"]': seo.description,
    };
    for (const [selector, value] of Object.entries(fields)) {
      document.head.querySelector(selector)?.setAttribute("content", value);
    }
  }, [copy, locale]);
  return null;
}
