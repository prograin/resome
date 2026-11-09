import { readFile } from "node:fs/promises";
import path from "node:path";

// Expand local HTML partials while leaving data slots for the static renderer.
export async function readTemplate(root, name = "layout", stack = []) {
  if (!/^[\w/-]+$/.test(name) || name.split("/").includes(".."))
    throw new Error(`Invalid template name: ${name}`);
  if (stack.includes(name)) throw new Error(`Circular template include: ${name}`);
  const source = await readFile(path.join(root, "src/templates", `${name}.html`), "utf8");
  const matches = [...source.matchAll(/\{\{>\s*([\w/-]+)\s*\}\}/g)];
  const parts = await Promise.all(
    matches.map(async (match) => [match[0], await readTemplate(root, match[1], [...stack, name])]),
  );
  let result = source;
  for (const [slot, html] of parts) result = result.replace(slot, () => html);
  return result;
}
