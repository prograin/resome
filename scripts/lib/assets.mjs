import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, readdir, access } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import sharp from "sharp";

const digest = (value) => createHash("sha256").update(value).digest("hex");

export async function optimizeImages(root) {
  const cachePath = path.join(root, ".backup/image-build-cache.json");
  let cache = {};
  try { cache = JSON.parse(await readFile(cachePath, "utf8")); } catch { /* First build. */ }
  const jobs = [];
  for (const file of await readdir(path.join(root, "assets/images"))) {
    if (!file.endsWith("-bg.jpg")) continue;
    for (const width of [960, 1920]) jobs.push({
      source: `assets/images/${file}`, target: `assets/images/optimized/${file.slice(0, -4)}-${width}.webp`, width, quality: 80,
    });
  }
  for (const file of await readdir(path.join(root, "assets/images/clients"))) {
    if (file.endsWith(".png")) jobs.push({ source: `assets/images/clients/${file}`, target: `assets/images/clients/${file.slice(0, -4)}.webp`, width: 128, quality: 85 });
  }
  for (const job of jobs) {
    const source = await readFile(path.join(root, job.source));
    const fingerprint = digest(source) + `:${job.width}:${job.quality}`;
    let exists = true;
    try { await access(path.join(root, job.target)); } catch { exists = false; }
    if (exists && cache[job.target] === fingerprint) continue;
    await mkdir(path.dirname(path.join(root, job.target)), { recursive: true });
    await sharp(source).rotate().resize(job.width, job.width, { fit: "inside", withoutEnlargement: true }).webp({ quality: job.quality, effort: 6 }).toFile(path.join(root, job.target));
    cache[job.target] = fingerprint;
    console.log(`Optimized ${job.target}`);
  }
  await mkdir(path.dirname(cachePath), { recursive: true });
  await writeFile(cachePath, JSON.stringify(cache, null, 2));
}

export async function assetFingerprint(root) {
  const hash = createHash("sha256");
  async function walk(directory) {
    const entries = (await readdir(path.join(root, directory), { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(file);
      else { hash.update(file.replaceAll("\\", "/")); hash.update(await readFile(path.join(root, file))); }
    }
  }
  await walk("assets");
  return hash.digest("hex");
}

export async function assetVersioner(root, version) {
  const context = { window: {}, document: { currentScript: { dataset: { assetVersion: version } } } };
  vm.runInNewContext(await readFile(path.join(root, "src/assets.js"), "utf8"), context);
  const assetUrl = context.window.SITE_ASSETS.url;
  return (source) => String(source)
    .replace(/(["'])([^"'<>\s]+)\1/g, (match, quote, value) => `${quote}${assetUrl(value)}${quote}`)
    .replace(/url\((["']?)([^)"']+)\1\)/g, (match, quote, value) => `url(${assetUrl(value.trim())})`);
}
