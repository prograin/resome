import { metadata } from "./metadata";
import { structuredData } from "./schema";
import { routes } from "../config/site";

export function routeMetadata(page) {
  const seo = metadata(page);
  const images = [
    { url: seo.image, width: seo.imageWidth, height: seo.imageHeight, alt: seo.imageAlt },
  ];
  const privatePage = routes[page].private;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    robots:
      privatePage || routes[page].noindex
        ? seo.robots
        : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      type: "website",
      siteName: "Prograin",
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      locale: seo.locale,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images,
    },
  };
}

export function JsonLd({ page }) {
  const value = structuredData(page);
  if (!value) return null;
  return (
    <script
      type="application/ld+json"
      id="localSeoSchema"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replaceAll("<", "\u003c") }}
    />
  );
}
