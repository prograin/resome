import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { build, transform } from "esbuild";

// Bundle source modules once at build time, keeping browser requests compact.
export async function bundleSource(root, entry) {
  const result = await build({
    absWorkingDir: root,
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: "iife",
    target: "es2020",
    charset: "utf8",
    legalComments: "none",
    logLevel: "silent",
  });
  return result.outputFiles[0].text;
}

export async function prepareRuntime(root) {
  const entries = {
    "src/app.js": "src/entries/app.js",
    "src/chunks/home.js": "src/pages/home.js",
    "src/chunks/order.js": "src/entries/order.js",
    "src/chunks/academy.js": "src/pages/academy.js",
    "src/chunks/contact.js": "src/pages/contact.js",
    "src/chunks/resume.js": "src/entries/resume.js",
  };
  const results = await Promise.allSettled(
    Object.entries(entries).map(async ([output, entry]) => [
      output,
      await bundleSource(root, entry),
    ]),
  );
  const scripts = new Map();
  for (const result of results) {
    if (result.status === "rejected") throw result.reason;
    scripts.set(...result.value);
  }
  return { fingerprint: [...scripts.values()].join("\n"), scripts };
}

export async function writeRuntime(root, runtime) {
  await mkdir(path.join(root, "src/chunks"), { recursive: true });
  const results = await Promise.allSettled(
    [...runtime.scripts].map(async ([name, source]) => {
      const { code } = await transform(source, {
        minify: true,
        target: "es2020",
        charset: "utf8",
        legalComments: "none",
      });
      await writeFile(path.join(root, name), code);
      return { file: name, bytes: Buffer.byteLength(code) };
    }),
  );
  for (const result of results) {
    if (result.status === "rejected") throw result.reason;
    console.log("JS " + result.value.file + ": " + result.value.bytes + " bytes");
  }
}
