// Keep editable source modules small; compiled runtime assets have separate budgets.
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const lineLimit = 250;
const generatedDirectories = new Set(["src/chunks", "src/styles", "src/css/vendor"]);
const generatedFiles = new Set(["src/app.js", "src/output.css"]);
const failures = [];
let checked = 0;
let longest = 0;

async function visit(directory) {
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) {
      if (!generatedDirectories.has(file)) await visit(file);
      continue;
    }
    if (generatedFiles.has(file) || !/\.(js|css|html|json)$/.test(file)) continue;
    const content = await readFile(path.join(root, file), "utf8");
    const lines = content.trimEnd().split(/\r?\n/).length;
    checked += 1;
    longest = Math.max(longest, lines);
    if (lines > lineLimit) failures.push(`${file}: ${lines} lines (limit ${lineLimit})`);
  }
}

await visit("src");
if (failures.length)
  throw new Error(`Split these source files into focused modules:\n${failures.join("\n")}`);
console.log(
  `PASS source structure: ${checked} editable files, largest ${longest} lines, limit ${lineLimit}`,
);
