import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir, readdir, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const digest = (value) => createHash("sha256").update(value).digest("hex");

export async function optimizeImages(root) {
  const cachePath = path.join(root, ".backup/image-build-cache.json");
  let cache = {};
  try {
    cache = JSON.parse(await readFile(cachePath, "utf8"));
  } catch {
    /* First build. */
  }
  const jobs = [];
  const backgrounds = await readdir(path.join(root, "assets/images"));
  const mobileBackgrounds = new Map(
    backgrounds
      .filter((file) => /-bg-mobile\.(jpg|png)$/i.test(file))
      .map((file) => [path.parse(file).name.slice(0, -"-mobile".length), file]),
  );
  for (const file of backgrounds) {
    if (!/-bg\.(jpg|png)$/i.test(file)) continue;
    const name = path.parse(file);
    const mobile = mobileBackgrounds.get(name.name) ?? file;
    for (const width of [960, 1920])
      jobs.push({
        source: `assets/images/${width === 960 ? mobile : file}`,
        target: `assets/images/optimized/${name.name}-${width}.webp`,
        width,
        quality: 80,
      });
  }
  for (const directory of ["assets/images/clients", "assets/icons/courses"]) {
    for (const file of await readdir(path.join(root, directory))) {
      if (file.endsWith(".png"))
        jobs.push({
          source: `${directory}/${file}`,
          target: `${directory}/${file.slice(0, -4)}.webp`,
          width: 128,
          quality: 85,
        });
    }
  }
  for (const job of jobs) {
    const source = await readFile(path.join(root, job.source));
    const fingerprint = digest(source) + `:${job.width}:${job.quality}`;
    let exists = true;
    try {
      await access(path.join(root, job.target));
    } catch {
      exists = false;
    }
    if (exists && cache[job.target] === fingerprint) continue;
    await mkdir(path.dirname(path.join(root, job.target)), { recursive: true });
    await sharp(source)
      .rotate()
      .resize(job.width, job.width, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: job.quality, effort: 6 })
      .toFile(path.join(root, job.target));
    cache[job.target] = fingerprint;
    console.log(`Optimized ${job.target}`);
  }
  await mkdir(path.dirname(cachePath), { recursive: true });
  await writeFile(cachePath, JSON.stringify(cache, null, 2));
}

export async function assetFingerprint(root, directory = "assets", exclude = new Set()) {
  const hash = createHash("sha256");
  async function walk(directory) {
    const entries = (await readdir(path.join(root, directory), { withFileTypes: true })).sort(
      (a, b) => a.name.localeCompare(b.name),
    );
    for (const entry of entries) {
      if (exclude.has(entry.name)) continue;
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(file);
      else {
        hash.update(file.replaceAll("\\", "/"));
        hash.update(await readFile(path.join(root, file)));
      }
    }
  }
  await walk(directory);
  return hash.digest("hex");
}
