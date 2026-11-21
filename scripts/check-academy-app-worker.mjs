import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import sharp from "sharp";
import {
  academyApp,
  academyLinkKind,
  isAcademyAppPath,
} from "../src/features/academy-app/paths.js";

const base = "https://www.prograin.ir";
for (const path of [academyApp.scope, "/academy/students", "/academy/students/dashboard/goals/"])
  assert.ok(isAcademyAppPath(path));
for (const path of ["/", "/academy/", "/academy/consultation/", "/academy/students-other/"])
  assert.equal(academyLinkKind(path, base), "blocked");
assert.equal(academyLinkKind("https://prograin.ir/contact/", base), "blocked");
assert.equal(academyLinkKind("https://github.com/prograin", base), "external");
assert.equal(academyLinkKind("javascript:alert(1)", base), "blocked");
assert.equal(academyLinkKind(academyApp.start, base), "inside");
const manifest = JSON.parse(await readFile("site.webmanifest.json", "utf8"));
assert.equal(manifest.scope, academyApp.scope);
assert.equal(manifest.start_url, academyApp.start);
assert.ok(manifest.icons.some((icon) => icon.purpose?.includes("maskable")));
for (const size of [48, 180, 192, 512]) {
  const name = size === 48 ? "favicon-48" : size === 180 ? "apple-touch-icon" : `icon-${size}`;
  const metadata = await sharp(`assets/icons/academy/${name}.png`).metadata();
  assert.equal(metadata.width, size);
  assert.equal(metadata.height, size);
  assert.equal(metadata.hasAlpha, false);
}
const worker = await readFile("public/academy-notifications-sw.js", "utf8");
const offline = await readFile("public/academy-offline.js", "utf8");
const events = {};
let disconnected = false,
  skipped = false,
  claimed = false;
const context = {
  URL,
  Response,
  self: {
    location: { origin: base },
    addEventListener: (name, handler) => {
      events[name] = handler;
    },
    skipWaiting: async () => {
      skipped = true;
    },
    clients: {
      claim: async () => {
        claimed = true;
      },
    },
  },
  fetch: async (_request, options) => {
    assert.equal(options.cache, "no-store");
    if (disconnected) throw new Error("Offline");
    return new Response("Private page");
  },
  caches: new Proxy(
    {},
    {
      get() {
        throw new Error("Private app pages must never enter CacheStorage");
      },
    },
  ),
};
context.importScripts = (url) => {
  assert.equal(url, "/academy-offline.js");
  runInNewContext(offline, context);
};
runInNewContext(worker, context);
for (const event of ["install", "activate"]) {
  let task;
  events[event]({
    waitUntil(value) {
      task = value;
    },
  });
  await task;
}
assert.ok(skipped && claimed);
async function navigate(path, mode = "navigate") {
  let response;
  events.fetch({
    request: { url: base + path, mode },
    respondWith(value) {
      response = value;
    },
  });
  return response ? await response : null;
}
assert.equal(await navigate("/"), null);
assert.equal(await navigate("/api/auth/get-session/"), null);
assert.equal(await navigate(academyApp.scope, "cors"), null);
assert.equal(await (await navigate(academyApp.scope)).text(), "Private page");
disconnected = true;
const fallback = await navigate("/academy/students/dashboard/profile/");
assert.match(fallback.headers.get("cache-control"), /no-store/);
assert.match(await fallback.text(), /You're offline/);
console.log(
  "PASS academy app: scoped manifest, opaque installation icons, safe link boundaries, network-only private navigation, public offline fallback and no account caching.",
);
