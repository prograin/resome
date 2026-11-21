export async function notificationRequest(path, options) {
  const [resource, query] = path.split("?");
  const response = await fetch(`/api/students/${resource}/${query ? `?${query}` : ""}`, {
    credentials: "same-origin",
    cache: "no-store",
    ...options,
    signal: options?.signal
      ? AbortSignal.any([options.signal, AbortSignal.timeout(10000)])
      : AbortSignal.timeout(10000),
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok) throw new Error("Notification request failed");
  return response.json();
}

export function dashboardHref(href) {
  if (typeof href !== "string" || !href.startsWith("/academy/students/dashboard/")) return null;
  const url = new URL(href, "https://academy.invalid");
  return url.origin === "https://academy.invalid" &&
    url.pathname.startsWith("/academy/students/dashboard/")
    ? `${url.pathname}${url.search}`
    : null;
}
