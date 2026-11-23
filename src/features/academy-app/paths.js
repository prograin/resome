import { studentPaths } from "../../lib/student-auth/paths.js";

export const academyApp = {
  name: "Prograin Academy",
  scope: studentPaths.signIn,
  start: `${studentPaths.signIn}?app=academy`,
  manifest: `${studentPaths.signIn}manifest.webmanifest`,
  worker: "/academy-notifications-sw.js",
  invitationKey: "prograin-academy-install-invited",
};

export function isAcademyAppPath(pathname) {
  return pathname === academyApp.scope.slice(0, -1) || pathname.startsWith(academyApp.scope);
}

export function academyLinkKind(href, base) {
  try {
    const url = new URL(href, base),
      current = new URL(base);
    if (["mailto:", "tel:"].includes(url.protocol)) return "external";
    if (!["https:", "http:"].includes(url.protocol)) return "blocked";
    const sameSite =
      url.origin === current.origin ||
      url.hostname.replace(/^www\./, "") === current.hostname.replace(/^www\./, "");
    if (sameSite)
      return url.origin === current.origin && isAcademyAppPath(url.pathname) ? "inside" : "blocked";
    return "external";
  } catch {
    return "blocked";
  }
}
