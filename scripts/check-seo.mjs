// Check the generated files themselves, without running any client JavaScript.
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPages } from "./lib/render.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (file) => readFile(path.join(root, file), "utf8");
const { SITE_CONFIG: config } = await loadPages(root);
const publicUrls = [];
const titles = new Set();

for (const [page, route] of Object.entries(config.routes)) {
  const html = await read(path.join(route.directory, "index.html"));
  const seo = config.metadata(page, "fa");
  await access(path.join(root, new URL(seo.image).pathname.replace(/^\//, "")));
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.ok(html.includes(`<title>${seo.title}</title>`));
  assert.equal((html.match(/name="description"/g) || []).length, 1);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
  assert.ok(html.includes(`rel="canonical" href="${seo.canonical}"`));
  assert.ok(html.includes(`property="og:url" content="${seo.canonical}"`));
  assert.ok(html.includes(`name="robots" content="${seo.robots}"`));
  assert.equal(/\{\{[A-Z_]+\}\}/.test(html), false, `Unfilled template: ${page}`);
  assert.equal(/localhost|127\.0\.0\.1/.test(html), false);
  assert.equal(titles.has(seo.title), false, `Duplicate title: ${page}`);
  titles.add(seo.title);

  if (!route.private) {
    publicUrls.push(seo.canonical);
    assert.ok(html.includes(`data-page="${page}" data-rendered-locale="fa"`));
    const schema = JSON.parse(html.match(/<script id="localSeoSchema" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(schema["@context"], "https://schema.org");
    assert.ok(schema["@graph"].some((item) => item.url === seo.canonical));
    const organization = schema["@graph"].find((item) => item["@type"] === "Organization");
    assert.equal(organization.address.addressLocality, config.location.city.fa);
    assert.equal(organization.address.addressRegion, config.location.region.fa);
    assert.ok(schema["@graph"].some((item) => item["@type"] === "City" && item.name === "اراک"));
    assert.ok(schema["@graph"].some((item) => item["@type"] === "AdministrativeArea" && item.name === "استان مرکزی"));
    assert.ok(html.includes(config.location.label.fa));
    for (const item of schema["@graph"].filter((item) => item["@type"] === "BreadcrumbList")) {
      assert.ok(item.itemListElement.length >= 2);
    }
    assert.equal(/href="\/(resume|portfolio|portfoilio)\/?"/.test(html), false);
    const content = html.match(new RegExp(`data-page="${page}"[^>]*>([\\s\\S]*?)<div id="resumePage"`))?.[1] || "";
    assert.ok(/<h1[\s>]/.test(content));
    assert.ok(content.replace(/<[^>]*>/g, "").trim().length > 250, `Missing initial content: ${page}`);
  } else {
    assert.equal(html.includes('id="localSeoSchema"'), false);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"#?]+)(?:\?[^"#]*)?"/g)) {
    const url = match[1];
    if (/^(https?:|mailto:|tel:)/.test(url)) continue;
    let file = url.replace(/^\.\//, "").replace(/^\//, "");
    if (!path.extname(file)) file = path.join(file, "index.html");
    await access(path.join(root, file));
  }
  console.log(`PASS static SEO: ${page}`);
}

const sitemap = await read("sitemap.xml");
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]).sort(), publicUrls.sort());
assert.equal(/resume|portfolio|portfoilio|localhost|127\.0\.0\.1/.test(sitemap), false);
const robots = await read("robots.txt");
assert.ok(robots.includes(`Sitemap: ${config.origin}/sitemap.xml`));
assert.equal(/Disallow:\s*\/(?:resume|portfolio|portfoilio)/.test(robots), false);
for (const alias of ["portfolio", "portfoilio"]) {
  assert.match(await read(`${alias}/index.html`), /name="robots" content="noindex, nofollow, noarchive"/);
}
const manifest = JSON.parse(await read("site.webmanifest"));
assert.match(await read("404.html"), /name="robots" content="noindex, follow"/);
for (const icon of manifest.icons) await access(path.join(root, icon.src.replace(/^\//, "")));
console.log("PASS sitemap, robots, private aliases, manifest and local links");
