import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const escape = (value) => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export async function loadPages(root, version = "") {
  const window = {};
  const context = vm.createContext({ window, URL, document: { currentScript: { dataset: { assetVersion: version } }, documentElement: { dir: "rtl" } } });
  for (const file of ["assets", "site-config", "local-icons", "pages/shared", "pages/home", "pages/projects", "pages/order", "pages/academy", "pages/contact"]) {
    vm.runInContext(await readFile(path.join(root, `src/${file}.js`), "utf8"), context, { filename: `${file}.js` });
  }
  return window;
}

export function renderHead(config, page) {
  const seo = config.metadata(page, "fa");
  const meta = (name, value, attribute = "name") => `<meta ${attribute}="${name}" content="${escape(value)}" />`;
  const schema = config.structuredData(page, "fa");
  return [
    `<title>${escape(seo.title)}</title>`, meta("description", seo.description), meta("robots", seo.robots),
    `<link rel="canonical" href="${seo.canonical}" />`,
    meta("theme-color", "#08111f"),
    ...Object.entries({ "og:type": "website", "og:site_name": "prograin", "og:title": seo.title, "og:description": seo.description, "og:url": seo.canonical, "og:locale": seo.locale, "og:image": seo.image, "og:image:width": seo.imageWidth, "og:image:height": seo.imageHeight, "og:image:alt": "prograin" }).map(([name, value]) => meta(name, value, "property")),
    meta("twitter:card", "summary_large_image"), meta("twitter:title", seo.title), meta("twitter:description", seo.description), meta("twitter:image", seo.image), meta("twitter:image:alt", "prograin"),
    ...(schema ? [`<script id="localSeoSchema" type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>`] : []),
  ].join("\n    ");
}

export function renderEntry(template, site, page, version) {
  const config = site.SITE_CONFIG;
  const route = config.routes[page];
  const slots = {
    SEO_HEAD: renderHead(config, page), ASSET_VERSION: version,
    STYLE_KEY: page,
    PAGE_STYLESHEET: route.private ? "./src/output.css" : `./src/styles/${page === "contact-page" ? "contact" : page}.css`,
    PAGE_CLASS: `page-${route.body}-active`,
    RESUME_VISIBILITY: page === "resume" ? "" : "hidden",
    FOOTER: `<footer id="siteFooter" class="site-footer"${route.private ? "" : ' data-rendered-locale="fa"'}>${route.private ? "" : site.PAGE_SHARED.footer("fa")}</footer>`,
    PAGE_PRELOAD: route.background ? [960, 1920].map((size) => `<link rel="preload" as="image" href="./assets/images/optimized/${route.background}-bg-${size}.webp" media="(width ${size === 960 ? "&lt;=" : "&gt;"} 48rem)" fetchpriority="high" />`).join("\n    ") : "",
  };
  for (const [key, slot] of [["home", "HOME"], ["order", "ORDER"], ["academy", "ACADEMY"], ["contact-page", "CONTACT"]]) {
    const current = config.routes[key];
    const active = key === page;
    slots[`PAGE_${slot}`] = `<section id="${current.container}" class="page-view${active ? "" : " hidden"}" data-page="${key}"${active ? ' data-rendered-locale="fa"' : ""}>${active ? site[current.renderer]("fa") : ""}</section>`;
  }
  let html = template.replace(/\{\{([A-Z_]+)\}\}/g, (match, name) => {
    if (!(name in slots)) throw new Error(`Unknown template slot: ${name}`);
    return slots[name];
  });
  // Mark navigation before JavaScript runs, and use one canonical form of internal URLs.
  html = html.replace(/<a\b([^>]*data-page-link="([^"]+)"[^>]*)>/g,
    (match, attributes, key) => `<a${attributes}${key === page ? ' aria-current="page"' : ""}>`);
  return html.replace(/href="\/(order|academy|contact)"/g, 'href="/$1/"').replace(/[\t ]+$/gm, "");
}

export async function writeDiscovery(root, config) {
  const urls = Object.values(config.routes).filter((route) => !route.private).map((route) => `  <url><loc>${config.origin}${route.path}</loc></url>`);
  await writeFile(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
  await writeFile(path.join(root, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /.backup/\nDisallow: /node_modules/\nDisallow: /scripts/\nDisallow: /src/templates/\n\n# Private routes use noindex; crawling is allowed so search engines can read it.\nSitemap: ${config.origin}/sitemap.xml\n`);
  // Supported by Cloudflare Pages and Netlify; other hosts should mirror these rules.
  const privateHeaders = ["/resume", "/resume/*", "/portfolio", "/portfolio/*", "/portfoilio", "/portfoilio/*"].map((route) => `${route}\n  X-Robots-Tag: noindex, nofollow, noarchive\n`);
  const htmlRoutes = ["/", "/index.html", ...["home", "academy", "order", "contact", "resume", "portfolio", "portfoilio"].flatMap((name) => [`/${name}`, `/${name}/`, `/${name}/index.html`])];
  const revalidate = htmlRoutes.map((route) => `${route}\n  Cache-Control: no-cache, must-revalidate\n`);
  const manifest = "/site-version.json\n  Cache-Control: no-store, no-cache, must-revalidate, max-age=0\n  X-Robots-Tag: noindex\n";
  await writeFile(path.join(root, "_headers"), [...privateHeaders, ...revalidate, manifest].join("\n"));
}
