import { createHash } from "node:crypto";
import { readFile, writeFile, access, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export async function generateAcademyIcons(root) {
  const directory = path.join(root, "assets/icons/academy");
  const source = await readFile(path.join(directory, "logo.svg"));
  const fingerprint = createHash("sha256").update(source).update("opaque-png-v1").digest("hex");
  const cache = path.join(root, ".backup/academy-icons.json");
  const sizes = { "favicon-48": 48, "apple-touch-icon": 180, "icon-192": 192, "icon-512": 512 };
  const outputs = Object.entries(sizes).map(([name, size]) => [
    path.join(directory, `${name}.png`),
    size,
  ]);
  if (
    (await readFile(cache, "utf8").catch(() => "")) === fingerprint &&
    (
      await Promise.all(
        outputs.map(([file]) =>
          access(file).then(
            () => true,
            () => false,
          ),
        ),
      )
    ).every(Boolean)
  )
    return;
  await Promise.all(
    outputs.map(([file, size]) =>
      sharp(source).resize(size, size).removeAlpha().png().toFile(file),
    ),
  );
  await mkdir(path.dirname(cache), { recursive: true });
  await writeFile(cache, fingerprint);
}
