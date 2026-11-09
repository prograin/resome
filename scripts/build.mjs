// Build compact CSS and synchronize the static route entry points.
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { loadPages, renderEntry, writeDiscovery } from "./lib/render.mjs";
import { prepareRuntime, writeRuntime } from "./lib/runtime.mjs";
import { trimStyles } from "./lib/styles.mjs";
import { optimizeImages, assetFingerprint, assetVersioner } from "./lib/assets.mjs";
import { readStyles } from "./lib/css.mjs";
import { readTemplate } from "./lib/templates.mjs";

const require = createRequire(import.meta.url);
const { transform } = require("lightningcss");
const root = fileURLToPath(new URL("../", import.meta.url));
const read = (file) => readFile(path.join(root, file), "utf8");
const write = (file, data) => writeFile(path.join(root, file), data);
await optimizeImages(root);

const styles = await readStyles(root);
const { code } = transform({
  filename: "src/css/index.css",
  code: Buffer.from(await trimStyles(root, styles)),
  minify: true,
});
await write("src/output.css", code);
const pageStyles = new Map();
await mkdir(path.join(root, "src/styles"), { recursive: true });
for (const page of ["home", "order", "academy", "contact-page"]) {
  const pageCss = (await trimStyles(root, styles, page)).replaceAll("../assets/", "../../assets/");
  const result = transform({
    filename: "src/css/index.css",
    code: Buffer.from(pageCss),
    minify: true,
  });
  pageStyles.set(page, result.code);
  const name = page === "contact-page" ? "contact" : page;
  await write(`src/styles/${name}.css`, result.code);
  console.log(`CSS ${page}: ${result.code.length} bytes`);
}

const template = await readTemplate(root);
const runtime = await prepareRuntime(root);
const hash = createHash("sha256");
hash.update(template);
hash.update(code);
for (const value of pageStyles.values()) hash.update(value);
hash.update(runtime.fingerprint);
hash.update(await assetFingerprint(root));
const version = hash.digest("hex").slice(0, 12);
const versionAssets = await assetVersioner(root, version);
await write("src/output.css", versionAssets(code));
for (const [page, css] of pageStyles) {
  await write(`src/styles/${page === "contact-page" ? "contact" : page}.css`, versionAssets(css));
}
await writeRuntime(root, runtime);
const site = await loadPages(root, version);
const routes = [
  ...Object.entries(site.SITE_CONFIG.routes).map(([page, route]) => ({
    page,
    directory: route.directory,
  })),
  { page: "home", directory: "home" },
  { page: "resume", directory: "portfolio" },
  { page: "resume", directory: "portfoilio" },
];

for (const route of routes) {
  const html = versionAssets(renderEntry(template, site, route.page, version));
  await mkdir(path.join(root, route.directory), { recursive: true });
  await write(path.join(route.directory, "index.html"), html);
}
await writeDiscovery(root, site.SITE_CONFIG);
await write(
  "404.html",
  versionAssets(
    (await read("src/templates/not-found.html")).replaceAll("{{ASSET_VERSION}}", version),
  ),
);
await write("site-version.json", JSON.stringify({ version }) + "\n");

console.log(`CSS: ${Buffer.byteLength(styles)} → ${code.length} bytes; assets: ${version}`);
console.log(`Updated ${routes.length} static entry points.`);
