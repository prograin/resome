"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const portfolioAnchors = new Set([
  "resumeHome",
  "filters",
  "skills",
  "projects",
  "experience",
  "education",
  "contact",
]);
const oldRoutes = {
  resume: "/resume/",
  order: "/order/",
  academy: "/academy/",
  "contact-page": "/contact/",
};

export function LegacyLinks() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== "/" && pathname.replace(/\/$/, "") !== "/home") return;
    function checkHash() {
      const hash = location.hash.slice(1);
      if (portfolioAnchors.has(hash)) location.replace(`/resume/#${hash}`);
      else if (Object.hasOwn(oldRoutes, hash)) location.replace(oldRoutes[hash]);
    }
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [pathname]);
  return null;
}
