// Keep metadata aligned with the statically generated HTML after client navigation.
(() => {
  "use strict";
  function setMeta(key, content, attribute = "name") {
    let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, key);
      document.head.append(element);
    }
    element.content = content;
  }

  function update(page, locale, privatePath = false) {
    const config = window.SITE_CONFIG;
    const seo = config.metadata(page, locale);
    document.title = seo.title;
    setMeta("description", seo.description);
    setMeta("robots", privatePath ? "noindex, nofollow, noarchive" : seo.robots);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", seo.canonical);
    for (const [key, value] of Object.entries({
      "og:title": seo.title, "og:description": seo.description,
      "og:url": seo.canonical, "og:image": seo.image,
      "og:locale": seo.locale, "og:site_name": "prograin", "og:type": "website",
      "og:image:width": seo.imageWidth, "og:image:height": seo.imageHeight,
    })) setMeta(key, value, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.description);
    setMeta("twitter:image", seo.image);
    let schema = document.getElementById("localSeoSchema");
    const data = config.structuredData(page, locale);
    if (!data) { schema?.remove(); return; }
    if (!schema) {
      schema = document.createElement("script");
      schema.id = "localSeoSchema";
      schema.type = "application/ld+json";
      document.head.append(schema);
    }
    schema.textContent = JSON.stringify(data);
  }
  window.SITE_SEO = { update };
})();
