"use client";

import { useEffect } from "react";

export function AcademyAppSetup() {
  useEffect(() => {
    void import("./register-worker")
      .then(({ registerAcademyWorker }) => registerAcademyWorker())
      .catch(() => {
        // An unavailable optional worker must not interrupt sign-in or the dashboard.
      });
  }, []);
  return null;
}
