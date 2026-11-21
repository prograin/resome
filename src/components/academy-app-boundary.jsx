"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AcademyAppContext, useStandaloneDisplay } from "../features/academy-app/app-mode";
import { academyLinkKind, isAcademyAppPath } from "../features/academy-app/paths";
import { studentPaths } from "../lib/student-auth/paths";

export function AcademyAppBoundary({ children }) {
  const standalone = useStandaloneDisplay();
  const pathname = usePathname();
  const router = useRouter();
  const history = useRef([]);
  const inside = isAcademyAppPath(pathname);
  useEffect(() => {
    if (!standalone) return;
    if (!inside) {
      router.replace(studentPaths.signIn);
      return;
    }
    const route = location.pathname + location.search;
    if (pathname === studentPaths.signIn) {
      history.current = [route];
      return;
    }
    if (history.current.at(-1) !== route) history.current = [...history.current, route].slice(-50);
  }, [standalone, inside, pathname, router]);
  useEffect(() => {
    if (!standalone) return;
    document.documentElement.dataset.academyApp = "true";
    const guard = (event) => {
      const anchor = event.target.closest?.("a[href]");
      if (!anchor) return;
      const kind = academyLinkKind(anchor.href, location.href);
      if (kind === "blocked") {
        event.preventDefault();
        event.stopPropagation();
      } else if (kind === "external") {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }
    };
    document.addEventListener("click", guard, true);
    return () => {
      delete document.documentElement.dataset.academyApp;
      document.removeEventListener("click", guard, true);
    };
  }, [standalone]);
  const back = useCallback(() => {
    history.current.pop();
    router.replace(history.current.pop() ?? studentPaths.dashboard);
  }, [router]);
  const value = useMemo(() => ({ standalone, back }), [standalone, back]);
  return (
    <AcademyAppContext.Provider value={value}>
      {standalone && !inside ? (
        <main className="academy-app-redirect" role="status">
          در حال بازگشت به آکادمی…
        </main>
      ) : (
        children
      )}
    </AcademyAppContext.Provider>
  );
}
