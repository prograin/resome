// Keep editable source modules small; compiled runtime assets have separate budgets.
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const lineLimits = { src: 200, scripts: 250 };
const generatedDirectories = new Set(["src/generated", "src/css/vendor"]);
const failures = [];
let checked = 0;
const longest = { src: 0, scripts: 0 };

async function visit(directory) {
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) {
      if (!generatedDirectories.has(file)) await visit(file);
      continue;
    }
    if (!/\.(m?jsx?|tsx?|css|html|json)$/.test(file)) continue;
    const content = await readFile(path.join(root, file), "utf8");
    const lines = content.trimEnd().split(/\r?\n/).length;
    checked += 1;
    const group = file.split("/")[0];
    const lineLimit = lineLimits[group];
    longest[group] = Math.max(longest[group], lines);
    if (lines > lineLimit) failures.push(`${file}: ${lines} lines (limit ${lineLimit})`);
  }
}

await visit("src");
await visit("scripts");
if (failures.length)
  throw new Error(`Split these source files into focused modules:\n${failures.join("\n")}`);
console.log(
  `PASS source structure: ${checked} editable files, source ${longest.src}/${lineLimits.src} lines, scripts ${longest.scripts}/${lineLimits.scripts} lines`,
);
