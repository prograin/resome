export function createUpdateController(currentVersion) {
  const dismissed = new Set();
  let initialized = false;
  let checking = false;
  let lastCheck = 0;
  let latestVersion = "";
  let retry = 0;
  let applying = false;
  let dispose = () => {};
  const copy = {
    fa: {
      title: "نسخه جدید سایت آماده است",
      message: "برای دیدن آخرین تغییرات و عکس‌ها، سایت را بروزرسانی کنید.",
      update: "بروزرسانی",
      later: "بعداً",
      applying: "در حال بروزرسانی…",
    },
    en: {
      title: "A new version is ready",
      message: "Update the site to see the latest changes and images.",
      update: "Update",
      later: "Later",
      applying: "Updating…",
    },
  };
  const dialog = () => document.getElementById("siteUpdateDialog");
  const lock = (value) => {
    document.documentElement.classList.toggle("site-update-open", value);
    document.body.classList.toggle("site-update-open", value);
  };

  function present() {
    clearTimeout(retry);
    const element = dialog();
    if (
      !element ||
      !latestVersion ||
      dismissed.has(latestVersion) ||
      document.hidden ||
      element.open ||
      applying
    )
      return;
    if (document.querySelector("[data-details-dialog-active]")) {
      retry = setTimeout(present, 750);
      return;
    }
    if (typeof element.showModal !== "function") return;
    const text = copy[document.documentElement.lang] || copy.fa;
    document.getElementById("siteUpdateTitle").textContent = text.title;
    document.getElementById("siteUpdateDescription").textContent = text.message;
    document.getElementById("siteUpdateApply").textContent = text.update;
    document.getElementById("siteUpdateLater").textContent = text.later;
    element.showModal();
    lock(true);
  }

  async function check() {
    if (!currentVersion || checking || document.hidden || navigator.onLine === false || applying)
      return;
    checking = true;
    lastCheck = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const url = new URL("/site-version.json", location.origin);
      url.searchParams.set("check", String(Date.now()));
      const response = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
        credentials: "same-origin",
      });
      if (!response.ok) return;
      const data = await response.json();
      if (typeof data.version !== "string" || !/^[a-f0-9]{12}$/i.test(data.version)) return;
      if (data.version !== currentVersion) {
        latestVersion = data.version;
        present();
      }
    } catch {
      /* Offline or an unavailable endpoint must not interrupt the site. */
    } finally {
      clearTimeout(timeout);
      checking = false;
    }
  }

  function init() {
    if (initialized || !currentVersion || !dialog()) return;
    initialized = true;
    const url = new URL(location.href);
    if (url.searchParams.get("_site_update") === currentVersion) {
      url.searchParams.delete("_site_update");
      history.replaceState(history.state, "", url.pathname + url.search + url.hash);
    }
    const listeners = new AbortController();
    const options = { signal: listeners.signal };
    dialog().addEventListener(
      "close",
      () => {
        lock(false);
        if (!applying && latestVersion) dismissed.add(latestVersion);
      },
      options,
    );
    document
      .getElementById("siteUpdateLater")
      .addEventListener("click", () => dialog().close(), options);
    document.getElementById("siteUpdateApply").addEventListener(
      "click",
      () => {
        if (!latestVersion || applying) return;
        applying = true;
        const button = document.getElementById("siteUpdateApply");
        button.disabled = true;
        button.textContent = (copy[document.documentElement.lang] || copy.fa).applying;
        const next = new URL(location.href);
        next.searchParams.set("_site_update", latestVersion);
        lock(false);
        dialog().close();
        location.replace(next.href);
      },
      options,
    );
    const resume = () => {
      if (document.hidden) return;
      present();
      if (Date.now() - lastCheck > 10000) void check();
    };
    document.addEventListener("visibilitychange", resume, options);
    window.addEventListener("focus", resume, options);
    window.addEventListener("online", resume, options);
    window.addEventListener(
      "pageshow",
      (event) => {
        if (!event.persisted) return;
        if (applying) {
          applying = false;
          dismissed.clear();
          document.getElementById("siteUpdateApply").disabled = false;
        }
        resume();
      },
      options,
    );
    const first = setTimeout(check, 15000);
    const interval = setInterval(check, 60000);
    dispose = () => {
      listeners.abort();
      clearTimeout(first);
      clearTimeout(retry);
      clearInterval(interval);
    };
  }
  return { init, check, dispose: () => dispose() };
}
