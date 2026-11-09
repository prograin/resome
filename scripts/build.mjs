// Build compact CSS and synchronize the static route entry points.
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { loadPages, renderEntry, writeDiscovery } from "./lib/render.mjs";

const require = createRequire(import.meta.url);
const { transform } = require("lightningcss");
const root = fileURLToPath(new URL("../", import.meta.url));
const read = (file) => readFile(path.join(root, file), "utf8");
const write = (file, data) => writeFile(path.join(root, file), data);

const styles = `${await read("src/styles.css")}\n${await read("src/ui.css")}`;
const { code } = transform({
  filename: "src/styles.css",
  code: Buffer.from(styles),
  minify: true,
});
await write("src/output.css", code);

const template = await read("src/templates/layout.html");
const assets = [...template.matchAll(/(?:href|src)="\.\/(src\/[^"?]+)(?:\?[^\"]*)?"/g)]
  .map((match) => match[1]);
const hash = createHash("sha256");
hash.update(template);
for (const asset of assets) hash.update(await read(asset));
const version = hash.digest("hex").slice(0, 12);
const site = await loadPages(root);
const routes = [
  ...Object.entries(site.SITE_CONFIG.routes).map(([page, route]) => ({ page, directory: route.directory })),
  { page: "home", directory: "home" },
  { page: "resume", directory: "portfolio" },
  { page: "resume", directory: "portfoilio" },
];

for (const route of routes) {
  const html = renderEntry(template, site, route.page, version);
  await mkdir(path.join(root, route.directory), { recursive: true });
  await write(path.join(route.directory, "index.html"), html);
}
await writeDiscovery(root, site.SITE_CONFIG);
await write("404.html", (await read("src/templates/not-found.html")).replaceAll("{{ASSET_VERSION}}", version));

console.log(`CSS: ${Buffer.byteLength(styles)} → ${code.length} bytes; assets: ${version}`);
console.log(`Updated ${routes.length} static entry points.`);
