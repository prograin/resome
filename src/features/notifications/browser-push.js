import { notificationRequest } from "./api";

export async function academyRegistration() {
  const registration = await navigator.serviceWorker.getRegistration("/academy/students/");
  return registration?.scope === new URL("/academy/students/", window.location.origin).href
    ? registration
    : null;
}

export async function syncBrowserPush(userId, subscription) {
  try {
    await notificationRequest("push", {
      method: "POST",
      body: JSON.stringify({ ...subscription.toJSON(), studentId: userId }),
    });
  } catch (error) {
    // A failed ownership check must not leave the previous account subscribed here.
    await subscription.unsubscribe().catch(() => {});
    throw error;
  }
}

export async function inspectBrowserPush(userId) {
  if (
    !window.isSecureContext ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  )
    return "unsupported";
  if (Notification.permission === "denied") return "denied";
  const registration = await academyRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return "disabled";
  await syncBrowserPush(userId, subscription);
  return "enabled";
}

export async function clearBrowserPush() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  const registration = await academyRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return;
  try {
    await notificationRequest("push", {
      method: "DELETE",
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });
  } finally {
    await subscription.unsubscribe();
  }
}

export async function subscribeBrowserPush(userId, publicKey) {
  const registration = await navigator.serviceWorker.register("/academy-notifications-sw.js", {
    scope: "/academy/students/",
  });
  if (!registration.active) {
    const worker = registration.installing ?? registration.waiting;
    if (!worker) throw new Error("Service worker unavailable");
    await new Promise((resolve, reject) => {
      const finish = (error) => {
        clearTimeout(timer);
        worker.removeEventListener("statechange", inspect);
        if (error) reject(error);
        else resolve();
      };
      const inspect = () => {
        if (worker.state === "activated") finish();
        if (worker.state === "redundant") finish(new Error("Service worker failed"));
      };
      const timer = setTimeout(() => finish(new Error("Service worker timeout")), 15000);
      worker.addEventListener("statechange", inspect);
      inspect();
    });
  }
  const binary = atob(publicKey.replace(/-/g, "+").replace(/_/g, "/"));
  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: Uint8Array.from(binary, (character) => character.charCodeAt(0)),
    }));
  await syncBrowserPush(userId, subscription);
}
