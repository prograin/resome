// Produce an upload directory containing runtime files only.
import { cp, readFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPages } from "./lib/render.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.resolve(root, "dist");
// Resolve and constrain the generated directory before any recursive removal.
if (path.dirname(output) !== path.resolve(root) || path.basename(output) !== "dist") {
  throw new Error("Unexpected output directory; refusing to replace it.");
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const { SITE_CONFIG: config } = await loadPages(root);
const entries = [
  ...Object.values(config.routes).map((route) => path.join(route.directory, "index.html")),
  "home/index.html", "portfolio/index.html", "portfoilio/index.html",
  "404.html", "robots.txt", "sitemap.xml", "site.webmanifest", "_headers",
];
const template = await readFile(path.join(root, "src/templates/layout.html"), "utf8");
const runtime = [...template.matchAll(/(?:href|src)="\.\/(src\/[^"?]+)(?:\?[^\"]*)?"/g)].map((match) => match[1]);
for (const file of [...new Set([...entries, ...runtime])]) {
  const destination = path.join(output, file);
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(path.join(root, file), destination);
}
await cp(path.join(root, "assets"), path.join(output, "assets"), {
  recursive: true,
  filter: (source) => {
    const relative = path.relative(root, source).replaceAll("\\", "/");
    return !/assets\/images\/[^/]+-bg\.jpg$/i.test(relative)
      && !/assets\/images\/clients\/[^/]+\.png$/i.test(relative);
  },
});
console.log(`Ready to publish: ${output}`);
console.log("Source templates, dependencies, backups and original background images excluded.");
