/* Academy app and push. Account pages, APIs and assets are never stored in CacheStorage. */
importScripts("/academy-offline.js");

self.addEventListener("install", (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.mode !== "navigate" || url.origin !== self.location.origin ||
      !(url.pathname === "/academy/students" || url.pathname.startsWith("/academy/students/"))) return;
  event.respondWith(fetch(event.request, { cache: "no-store" }).catch(() => self.academyOfflineResponse()));
});
const databaseName = "prograin-academy-push";

function updateSeenTag(tag, remove = false) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("seen-tags", { keyPath: "tag" });
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction("seen-tags", "readwrite");
      const store = transaction.objectStore("seen-tags");
      let fresh = false;
      if (remove) store.delete(tag);
      else {
        // Claim atomically before display so simultaneous deliveries cannot duplicate it.
        const lookup = store.get(tag);
        lookup.onsuccess = () => {
          if (lookup.result) return;
          store.put({ tag });
          fresh = true;
        };
      }
      transaction.oncomplete = () => {
        database.close();
        resolve(fresh);
      };
      transaction.onerror = () => {
        database.close();
        reject(transaction.error);
      };
      transaction.onabort = () => {
        database.close();
        reject(transaction.error);
      };
    };
  });
}

function safeDashboardUrl(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value, self.location.origin);
    url.search = "";
    url.hash = "";
    return url.origin === self.location.origin &&
      url.pathname.startsWith("/academy/students/dashboard/")
      ? url
      : null;
  } catch {
    return null;
  }
}

self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      let payload;
      try {
        payload = event.data?.json();
      } catch {
        return;
      }
      const url = safeDashboardUrl(payload?.url);
      // Course assignments stay in-app. Only award-history links can trigger push.
      if (
        !url ||
        url.pathname !== "/academy/students/dashboard/history/"
      )
        return;
      if (
        typeof payload.title !== "string" ||
        typeof payload.tag !== "string" ||
        !payload.tag ||
        payload.tag.length > 200
      )
        return;
      if (!(await updateSeenTag(payload.tag))) return;
      try {
        await self.registration.showNotification(payload.title, {
          icon: "/assets/icons/academy/icon-192.png",
          body: typeof payload.body === "string" ? payload.body : "",
          tag: payload.tag,
          data: { url: url.href },
        });
      } catch (error) {
        await updateSeenTag(payload.tag, true);
        throw error;
      }
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = safeDashboardUrl(event.notification.data?.url);
  if (!url) return;
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of windows) {
        if (!safeDashboardUrl(client.url)) continue;
        const navigated = await client.navigate(url.href);
        if (navigated) {
          await navigated.focus();
          return;
        }
      }
      await self.clients.openWindow(url.href);
    })(),
  );
});
