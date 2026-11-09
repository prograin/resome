import { readFile } from "node:fs/promises";
import path from "node:path";

// Assemble sources in declared order before pruning and minifying. Asset URLs stay
// relative to the generated src/output.css, independent of source-file nesting.
export async function readStyles(root, file = "src/css/index.css", stack = []) {
  if (stack.includes(file)) throw new Error(`Circular stylesheet include: ${file}`);
  const source = await readFile(path.join(root, file), "utf8");
  const matches = [...source.matchAll(/^@import "([^"]+)";\s*$/gm)];
  let cursor = 0;
  const output = [];
  for (const match of matches) {
    output.push(source.slice(cursor, match.index));
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1]));
    if (!target.startsWith("src/css/"))
      throw new Error(`Stylesheet outside source directory: ${target}`);
    output.push(await readStyles(root, target, [...stack, file]));
    cursor = match.index + match[0].length;
  }
  output.push(source.slice(cursor));
  return output.join("\n");
}
