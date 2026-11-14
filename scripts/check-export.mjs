import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { origin, routes } from "../src/config/site.js";

const output = new URL("../out/", import.meta.url);
const read = (name) => readFile(new URL(name, output), "utf8");
const publicRoutes = Object.values(routes).filter((route) => !route.private);
for (const route of publicRoutes) {
  const html = await read(`${route.path.slice(1)}index.html`);
  assert.ok(html.includes(`<link rel="canonical" href="${origin}${route.path}"`), route.path);
  assert.match(html, /<meta name="robots" content="index, follow/);
  assert.match(html, /<h1[ >]/);
  assert.match(html, /id="localSeoSchema"/);
  assert.ok(!html.includes("/src/app.js"));
}
for (const name of ["resume", "portfolio", "portfoilio"]) {
  const html = await read(`${name}/index.html`);
  assert.match(html, /<meta name="robots" content="noindex, nofollow, noarchive"/);
  assert.doesNotMatch(html, /id="localSeoSchema"/);
}
const sitemap = await read("sitemap.xml");
assert.deepEqual(
  [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((item) => item[1]).sort(),
  publicRoutes.map((route) => origin + route.path).sort(),
);
assert.ok((await read("robots.txt")).includes(`Sitemap: ${origin}/sitemap.xml`));
const manifest = JSON.parse(await read("site.webmanifest"));
for (const icon of manifest.icons) await access(new URL(icon.src.slice(1), output));
const release = JSON.parse(await read("site-version.json"));
assert.match(release.version, /^[a-f0-9]{12}$/);
assert.ok((await read("index.html")).includes(`styles/home.css?v=${release.version}`));
assert.match(await read("404.html"), /<meta name="robots" content="noindex"/);
console.log("PASS Next.js export, canonicals, sitemap, assets and portfolio indexing rules");
