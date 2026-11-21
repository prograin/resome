import { useState } from "react";
import useSWR from "swr";
import { notificationRequest } from "./api";
import { inspectBrowserPush, subscribeBrowserPush } from "./browser-push";

export function useWebPush(userId) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const config = useSWR(
    userId ? ["academy-push", userId] : null,
    () => notificationRequest("push"),
    { shouldRetryOnError: false },
  );
  // Both header layouts share the same inspection, cache and in-flight sync.
  const inspection = useSWR(
    userId ? ["academy-browser-push", userId] : null,
    () => inspectBrowserPush(userId),
    { shouldRetryOnError: false },
  );
  const status = inspection.error ? "disabled" : (inspection.data ?? "loading");

  async function toggle() {
    if (busy || !config.data?.publicKey) return;
    setBusy(true);
    setError(false);
    try {
      // Only an explicit user action may request permission.
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        await inspection.mutate(permission === "denied" ? "denied" : "disabled", {
          revalidate: false,
        });
        return;
      }
      await subscribeBrowserPush(userId, config.data.publicKey);
      await inspection.mutate("enabled", { revalidate: false });
    } catch {
      await inspection.mutate("disabled", { revalidate: false });
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  return {
    status,
    busy,
    toggle,
    async retry() {
      if (busy) return;
      setBusy(true);
      setError(false);
      try {
        await Promise.allSettled([config.mutate(), inspection.mutate()]);
      } finally {
        setBusy(false);
      }
    },
    error: error || inspection.error || config.error,
    available: Boolean(config.data?.publicKey),
  };
}
