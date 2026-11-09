import { origin, location, contact, routes } from "../config/site.js";
import { metadata } from "./metadata.js";
const asset = (value) => window.SITE_ASSETS.url(value);

function structuredData(page, locale = "fa") {
  if (routes[page]?.private) return null;
  const meta = metadata(page, locale);
  const person = `${origin}/#person`;
  const organization = `${origin}/#organization`;
  const website = `${origin}/#website`;
  const city = `${origin}/#arak`;
  const province = `${origin}/#markazi`;
  const address = {
    "@type": "PostalAddress",
    addressLocality: location.city[locale],
    addressRegion: location.region[locale],
    addressCountry: location.country,
  };
  const graph = [
    {
      "@type": "Organization",
      "@id": organization,
      name: "Prograin",
      url: `${origin}/`,
      address,
      areaServed: [{ "@id": city }, { "@id": province }],
      logo: {
        "@type": "ImageObject",
        url: asset(`${origin}/assets/icons/icon-512.png`),
        width: 512,
        height: 512,
      },
      founder: { "@id": person },
      email: contact.email,
      telephone: "+989914663783",
      sameAs: [
        `https://t.me/${contact.telegram}`,
        contact.linkedin,
        "https://www.youtube.com/@Prograin_ARR",
      ],
    },
    {
      "@type": "Person",
      "@id": person,
      name: "احمدرضا رضایی",
      alternateName: "Ahmadreza Rezaei",
      jobTitle:
        locale === "fa"
          ? "برنامه‌نویس و مدرس برنامه‌نویسی"
          : "Software developer and programming instructor",
      worksFor: { "@id": organization },
      image: asset(`${origin}/assets/images/profile.jpg`),
      address,
      knowsAbout: [
        "Programming",
        "Web development",
        "Software development",
        "Programming education",
      ],
    },
    {
      "@type": "City",
      "@id": city,
      name: location.city[locale],
      alternateName: locale === "fa" ? "Arak" : "اراک",
      containedInPlace: { "@id": province },
    },
    {
      "@type": "AdministrativeArea",
      "@id": province,
      name: locale === "fa" ? "استان مرکزی" : "Markazi Province",
      containedInPlace: { "@type": "Country", name: "Iran", identifier: "IR" },
    },
    {
      "@type": "WebSite",
      "@id": website,
      name: "Prograin",
      url: `${origin}/`,
      publisher: { "@id": organization },
      inLanguage: ["fa-IR", "en"],
    },
    {
      "@type": page === "contact-page" ? "ContactPage" : "WebPage",
      "@id": `${meta.canonical}#webpage`,
      url: meta.canonical,
      name: meta.title,
      description: meta.description,
      inLanguage: locale === "fa" ? "fa-IR" : "en",
      isPartOf: { "@id": website },
      about: {
        "@id": page === "academy" || page === "order" ? `${meta.canonical}#service` : person,
      },
      ...(page === "home" ? {} : { breadcrumb: { "@id": `${meta.canonical}#breadcrumb` } }),
    },
  ];
  if (page !== "home")
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${meta.canonical}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: metadata("home", locale).label,
          item: `${origin}/`,
        },
        { "@type": "ListItem", position: 2, name: meta.label, item: meta.canonical },
      ],
    });
  if (page === "academy" || page === "order")
    graph.push({
      "@type": "Service",
      "@id": `${meta.canonical}#service`,
      name:
        page === "academy"
          ? locale === "fa"
            ? "آموزش خصوصی و نیمه‌خصوصی برنامه‌نویسی"
            : "Private and semi-private Programming training"
          : locale === "fa"
            ? "طراحی سایت و توسعه نرم‌افزار اختصاصی"
            : "Custom websites and software development",
      serviceType: page === "academy" ? "Programming training" : "Software development",
      provider: { "@id": person },
      url: meta.canonical,
      areaServed: [{ "@id": city }, { "@id": province }, { "@type": "Country", name: "Iran" }],
    });
  return { "@context": "https://schema.org", "@graph": graph };
}

export { structuredData };
