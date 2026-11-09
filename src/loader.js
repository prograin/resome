// Fetch only the current page template; portfolio data stays out of public loads.
(() => {
  "use strict";
  const script = document.currentScript;
  const base = new URL("./chunks/", script?.src || new URL("./src/app.js", document.baseURI));
  const version = script?.dataset.assetVersion || "";
  const pending = new Map();
  const styles = new Map();
  const pages = {
    home: ["home", "PAGE_HOME"],
    order: ["order", "PAGE_ORDER"],
    academy: ["academy", "PAGE_ACADEMY"],
    "contact-page": ["contact", "PAGE_CONTACT"],
  };

  function load(name) {
    if (pending.has(name)) return pending.get(name);
    const promise = new Promise((resolve, reject) => {
      const element = document.createElement("script");
      element.src = new URL(`${name}.js?v=${encodeURIComponent(version)}`, base).href;
      element.async = true;
      element.onload = resolve;
      element.onerror = () => {
        pending.delete(name);
        element.remove();
        reject(new Error(`Could not load page code: ${name}`));
      };
      document.head.append(element);
    });
    pending.set(name, promise);
    return promise;
  }

  function loadStyle(page) {
    if (document.querySelector(`link[data-page-style="${page}"]`)) return Promise.resolve();
    if (styles.has(page)) return styles.get(page);
    const promise = new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      const name = page === "contact-page" ? "contact" : page;
      const file = page === "resume" ? "../output.css" : `../styles/${name}.css`;
      link.href = new URL(`${file}?v=${encodeURIComponent(version)}`, base).href;
      link.onload = () => {
        link.dataset.pageStyle = page;
        resolve();
      };
      link.onerror = () => {
        styles.delete(page);
        link.remove();
        reject(new Error(`Could not load page styles: ${page}`));
      };
      document.head.append(link);
    });
    styles.set(page, promise);
    return promise;
  }

  async function ensureCode(page) {
    if (page === "resume") {
      if (!window.CREATE_RESUME_UI) await load("resume");
      return;
    }
    const entry = pages[page];
    if (entry && !window[entry[1]]) await load(entry[0]);
  }
  const ensure = (page) => Promise.all([loadStyle(page), ensureCode(page)]);
  window.PAGE_LOADER = { ensure };
})();
