import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { PurgeCSS } from "purgecss";
import { loadPages } from "./render.mjs";

export async function trimStyles(root, styles, page = null) {
  const content = [];
  async function collect(directory) {
    for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
      if (["chunks", "assets"].includes(entry.name)) continue;
      const name = path.join(directory, entry.name);
      if (entry.isDirectory()) await collect(name);
      else if ((name.endsWith(".js") && entry.name !== "app.js") || name.endsWith(".html")) {
        content.push({ raw: await readFile(path.join(root, name), "utf8"), extension: path.extname(name).slice(1) });
      }
    }
  }
  if (!page) await collect("src");
  else {
    let shell = await readFile(path.join(root, "src/templates/layout.html"), "utf8");
    const first = shell.indexOf('      <div id="resumePage"');
    const last = shell.indexOf("    </main>", first);
    if (first >= 0 && last > first) shell = shell.slice(0, first) + shell.slice(last);
    content.push({ raw: shell, extension: "html" });
    for (const name of ["script", "loader", "pages/index", `pages/${page === "contact-page" ? "contact" : page}`]) {
      content.push({ raw: await readFile(path.join(root, `src/${name}.js`), "utf8"), extension: "js" });
    }
  }
  // Include generated class names such as contact-action--primary and the footer shell.
  const site = await loadPages(root);
  for (const locale of ["fa", "en"]) {
    content.push({ raw: `<footer class="site-footer">${site.PAGE_SHARED.footer(locale)}</footer>`, extension: "html" });
    for (const [key, route] of Object.entries(site.SITE_CONFIG.routes)) {
      if (route.renderer && (!page || page === key)) content.push({ raw: site[route.renderer](locale), extension: "html" });
    }
  }
  const [result] = await new PurgeCSS().purge({
    content, css: [{ raw: styles }], keyframes: true, variables: false, fontFace: false, rejected: true,
    defaultExtractor: (source) => source.match(/[\w\-/:.\[\]%#()]+/g) || [],
    safelist: { standard: [/\[/, /^page-.*-active$/, "dark", "rtl", "hidden", "flex"] },
    dynamicAttributes: ["dir", "hidden", "data-kind", "data-tone", "data-active-plan", "data-academy-column", "data-project-tone", "aria-expanded", "aria-selected", "aria-current"],
  });
  console.log(`CSS selectors removed (${page || "complete"}): ${result.rejected.length}`);
  return result.css;
}
