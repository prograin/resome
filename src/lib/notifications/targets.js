import { studentPaths } from "../student-auth/paths.js";

export function notificationHref(notification) {
  if (notification.kind === "award") return studentPaths.history;
  if (notification.kind === "course") return studentPaths.courses;
  throw new Error("Unsupported notification target.");
}

export function notificationReturnTo(value) {
  if (
    typeof value !== "string" ||
    value.length > 300 ||
    !value.startsWith("/") ||
    value.startsWith("//")
  )
    return null;
  try {
    const url = new URL(value, "https://return.invalid");
    if (url.origin !== "https://return.invalid") return null;
    return [studentPaths.notifications, studentPaths.history, studentPaths.courses].includes(
      url.pathname,
    ) &&
      !url.search &&
      !url.hash
      ? url.pathname
      : null;
  } catch {
    return null;
  }
}
