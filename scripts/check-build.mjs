import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { origin, routes } from "../src/config/site.js";

const output = new URL("../.next/server/app/", import.meta.url);
const assets = new URL("../public/", import.meta.url);
const read = (name) => readFile(new URL(name, output), "utf8");
const publicRoutes = Object.values(routes).filter((route) => !route.private && !route.noindex);
for (const route of publicRoutes) {
  const html = await read(`${route.path.slice(1, -1) || "index"}.html`);
  assert.ok(html.includes(`<link rel="canonical" href="${origin}${route.path}"`), route.path);
  assert.match(html, /<meta name="robots" content="index, follow/);
  assert.match(html, /<h1[ >]/);
  assert.match(html, /id="localSeoSchema"/);
  assert.ok(!html.includes("/src/app.js"));
}
for (const name of ["resume", "portfolio", "portfoilio"]) {
  const html = await read(`${name}.html`);
  assert.match(html, /<meta name="robots" content="noindex, nofollow, noarchive"/);
  assert.doesNotMatch(html, /id="localSeoSchema"/);
}
const sitemap = await read("sitemap.xml.body");
assert.deepEqual(
  [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((item) => item[1]).sort(),
  publicRoutes.map((route) => origin + route.path).sort(),
);
assert.ok((await read("robots.txt.body")).includes(`Sitemap: ${origin}/sitemap.xml`));
const manifest = JSON.parse(await read("site.webmanifest.body"));
for (const icon of manifest.icons) await access(new URL(icon.src.slice(1), assets));
const release = JSON.parse(await readFile(new URL("site-version.json", assets), "utf8"));
assert.match(release.version, /^[a-f0-9]{12}$/);
assert.ok((await read("index.html")).includes(`styles/home.css?v=${release.version}`));
const studentStyles = await readFile(new URL("styles/students.css", assets), "utf8");
assert.match(studentStyles, /\.academy-admin__catalog/);
assert.match(studentStyles, /\.student-login/);
for (const group of ["home", "academy", "order", "contact"]) {
  const styles = await readFile(new URL(`styles/${group}.css`, assets), "utf8");
  assert.doesNotMatch(styles, /\.academy-admin__catalog|\.student-login/, group);
}
assert.match(await read("_not-found.html"), /<meta name="robots" content="noindex"/);
console.log("PASS Next.js build, canonicals, sitemap, assets and portfolio indexing rules");
