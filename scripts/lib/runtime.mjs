import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { transform } from "esbuild";

export async function prepareRuntime(root) {
  const read = (name) => readFile(path.join(root, `src/${name}.js`), "utf8");
  const core = ["assets", "site-config", "seo", "updates", "loader", "local-icons", "pages/shared", "pages/index", "script"];
  const pages = { home: ["pages/home"], order: ["pages/projects", "pages/order"], academy: ["pages/academy"], contact: ["pages/contact"], resume: ["data", "resume"] };
  const names = [...new Set([...core, ...Object.values(pages).flat()])];
  const sources = Object.fromEntries(await Promise.all(names.map(async (name) => [name, await read(name)])));
  const dataContext = { window: {} };
  vm.runInNewContext(sources.data, dataContext);
  const ui = Object.fromEntries(Object.entries(dataContext.window.PORTFOLIO_DATA_I18N).map(([locale, value]) => [locale, { ui: value.ui }]));
  const scripts = new Map([
    ["src/app.js", [`window.PORTFOLIO_DATA_I18N=${JSON.stringify(ui)};`, ...core.map((name) => sources[name])].join("\n")],
    ...Object.entries(pages).map(([name, entries]) => [`src/chunks/${name}.js`, entries.map((entry) => sources[entry]).join("\n")]),
  ]);
  return { fingerprint: [...scripts.values()].join("\n"), scripts };
}

export async function writeRuntime(root, runtime) {
  await mkdir(path.join(root, "src/chunks"), { recursive: true });
  const results = await Promise.allSettled([...runtime.scripts].map(async ([name, source]) => {
    const { code } = await transform(source, { minify: true, target: "es2020", charset: "utf8", legalComments: "none" });
    await writeFile(path.join(root, name), code);
    return { file: name, bytes: Buffer.byteLength(code) };
  }));
  for (const result of results) {
    if (result.status === "rejected") throw result.reason;
    console.log(`JS ${result.value.file}: ${result.value.bytes} bytes`);
  }
}
