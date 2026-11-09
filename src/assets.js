// A release-specific URL keeps old visual assets out of a newly loaded release.
(() => {
  "use strict";
  const version = document.currentScript?.dataset.assetVersion || "";
  const isAsset = (value) => /(?:^|\/)assets\/.*\.(?:avif|webp|png|jpe?g|svg|ico|woff2?)(?:[?#]|$)/i.test(String(value));
  function url(value) {
    if (!version || !isAsset(value)) return value;
    const [base, fragment] = String(value).split("#", 2);
    const updated = /[?&]v=/.test(base)
      ? base.replace(/([?&])v=[^&]*/g, `$1v=${version}`)
      : `${base}${base.includes("?") ? "&" : "?"}v=${version}`;
    return updated + (fragment === undefined ? "" : `#${fragment}`);
  }
  window.SITE_ASSETS = { version, url };
})();
