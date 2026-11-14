import { createHash } from "node:crypto";
import { cp, mkdir, readFile, readdir, realpath, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "lightningcss";
import { PurgeCSS } from "purgecss";
import { optimizeImages, assetFingerprint } from "./lib/assets.mjs";
import { readStyles } from "./lib/css.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = (file) => path.join(root, file);

async function collect(directory) {
  const entries = await readdir(source(directory), { withFileTypes: true });
  const contents = await Promise.all(
    entries.map(async (entry) => {
      const file = `${directory}/${entry.name}`;
      if (entry.isDirectory()) return collect(file);
      if (!/\.jsx?$/.test(file)) return [];
      return [{ raw: await readFile(source(file), "utf8"), extension: "js" }];
    }),
  );
  return contents.flat();
}

async function compileStyles(stylesheet, content, version) {
  const [trimmed] = await new PurgeCSS().purge({
    content,
    css: [{ raw: stylesheet }],
    keyframes: true,
    defaultExtractor: (value) => value.match(/[\w\-/:.\[\]%#()]+/g) || [],
    safelist: {
      standard: [
        /\[/,
        /^contact-action--/,
        "dark",
        "rtl",
        "hidden",
        "flex",
        "is-bg-ready",
        "modal-open",
        "site-update-open",
      ],
    },
  });
  const css = trimmed.css.replace(
    /url\((["']?)(\/assets\/[^)"']+)\1\)/g,
    (_, quote, url) => `url("${url}?v=${version}")`,
  );
  return transform({ filename: "site.css", code: Buffer.from(css), minify: true }).code;
}

await optimizeImages(root);
const hash = createHash("sha256");
hash.update(await assetFingerprint(root));
hash.update(await assetFingerprint(root, "src", new Set(["generated"])));
for (const file of [
  "package-lock.json",
  "next.config.mjs",
  "scripts/prepare-next.mjs",
  "site.webmanifest.json",
]) {
  hash.update(await readFile(source(file)));
}
const version = hash.digest("hex").slice(0, 12);
const stylesheet = await readStyles(root);
const common = await Promise.all(["src/components", "src/app", "src/config"].map(collect)).then(
  (sources) => sources.flat(),
);
const styles = await Promise.all(
  ["home", "order", "academy", "contact", "portfolio", "error"].map(async (name) => {
    const feature = name === "error" ? [] : await collect(`src/features/${name}`);
    const portfolio = name === "portfolio" ? await collect("src/resume") : [];
    const code = await compileStyles(stylesheet, [...common, ...feature, ...portfolio], version);
    return [name, code];
  }),
);
const release = JSON.stringify({ version }) + "\n";

await mkdir(source("src/generated"), { recursive: true });
await mkdir(source("public/styles"), { recursive: true });
// This directory is generated from the repository's source assets.
const publicDirectory = await realpath(source("public"));
const workspace = await realpath(root);
if (path.relative(workspace, publicDirectory) !== "public")
  throw new Error("Unexpected public directory.");
const outputAssets = path.join(publicDirectory, "assets");
const resolvedAssets = await realpath(outputAssets).catch((error) => {
  if (error.code !== "ENOENT") throw error;
  return outputAssets;
});
if (resolvedAssets !== outputAssets) throw new Error("Unexpected generated asset directory.");
await rm(outputAssets, { recursive: true, force: true });
await cp(source("assets"), source("public/assets"), {
  recursive: true,
  filter: (file) => {
    const relative = path.relative(source("assets"), file).replaceAll("\\", "/");
    return (
      relative !== "fonts/Vazirmatn-Variable.woff2" &&
      !/^images\/[^/]+-bg\.jpg$/i.test(relative) &&
      !/^images\/clients\/[^/]+\.png$/i.test(relative)
    );
  },
});
await Promise.all([
  writeFile(source("src/generated/release.json"), release),
  writeFile(source("public/site-version.json"), release),
  ...styles.map(([name, code]) => writeFile(source(`public/styles/${name}.css`), code)),
  cp(source("_headers"), source("public/_headers")),
]);
console.log(
  `Prepared site assets for ${version}: ${styles.map(([name, code]) => `${name} ${code.length} B`).join(", ")}`,
);
