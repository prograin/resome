"use client";

import { useEffect } from "react";
import { usePreferences } from "../../components/preferences";

export function AcademyAppSetup() {
  const { theme } = usePreferences();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const color = getComputedStyle(document.body).getPropertyValue("--academy-surface").trim();
      if (color) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
    });
    return () => cancelAnimationFrame(frame);
  }, [theme]);
  useEffect(() => {
    void import("./register-worker")
      .then(({ registerAcademyWorker }) => registerAcademyWorker())
      .catch(() => {
        // An unavailable optional worker must not interrupt sign-in or the dashboard.
      });
  }, []);
  return null;
}
