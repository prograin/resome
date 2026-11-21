import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { IDBFactory } from "fake-indexeddb";

const source = await readFile(
  new URL("../public/academy-notifications-sw.js", import.meta.url),
  "utf8",
);
const events = {},
  shown = [],
  opened = [];
const self = {
  location: { origin: "https://www.prograin.ir" },
  addEventListener: (name, callback) => {
    events[name] = callback;
  },
  registration: { showNotification: async (title, body) => shown.push({ title, ...body }) },
  clients: { matchAll: async () => [], openWindow: async (url) => opened.push(url) },
};
runInNewContext(source, { self, indexedDB: new IDBFactory(), URL });
const payload = {
  title: "Prograin",
  body: "New score",
  tag: "test-grade-1",
  url: "/academy/students/dashboard/history/",
};
const push = async (message) => {
  let task;
  events.push({
    data: { json: () => message },
    waitUntil: (value) => {
      task = value;
    },
  });
  await task;
};
await Promise.all([push(payload), push(payload)]);
assert.equal(shown.length, 1, "concurrent duplicate tags must display once");
await push(payload);
assert.equal(shown.length, 1, "dismissed notifications must not be displayed again");
await push({ ...payload, tag: "external", url: "https://evil.test/" });
await push({ ...payload, tag: "course", url: "/academy/students/dashboard/courses/?course=1" });
assert.equal(shown.length, 1);
const originalShow = self.registration.showNotification;
self.registration.showNotification = async () => {
  throw new Error("Simulated display failure");
};
await assert.rejects(push({ ...payload, tag: "retry-display" }));
self.registration.showNotification = originalShow;
await push({ ...payload, tag: "retry-display" });
assert.equal(shown.length, 2, "failed browser display must not permanently claim the tag");
let task;
events.notificationclick({
  notification: { close() {}, data: { url: shown[0].data.url } },
  waitUntil: (value) => {
    task = value;
  },
});
await task;
assert.equal(opened[0], "https://www.prograin.ir/academy/students/dashboard/history/");
events.notificationclick({
  notification: { close() {}, data: { url: "https://evil.test/" } },
  waitUntil() {
    throw Error("Unsafe target was accepted");
  },
});
console.log(
  "PASS push worker: persistent/concurrent dedupe, grade-only display, safe click targets and no real browser notifications.",
);
