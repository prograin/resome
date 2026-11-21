"use client";

import { useEffect } from "react";
import { version } from "../config/assets";
import { UpdateMarkup } from "./update-markup";

export function SiteUpdates() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    let disposed = false;
    let controller;
    const initialize = () => {
      void import("./update-controller")
        .then(({ createUpdateController }) => {
          if (disposed) return;
          controller = createUpdateController(version);
          controller.init();
          window.SITE_UPDATES = controller;
        })
        .catch(() => {
          /* An unavailable optional update check must not interrupt the page. */
        });
    };
    const idle = "requestIdleCallback" in window;
    const pending = idle
      ? window.requestIdleCallback(initialize, { timeout: 2000 })
      : window.setTimeout(initialize, 1000);
    return () => {
      disposed = true;
      if (idle) window.cancelIdleCallback(pending);
      else window.clearTimeout(pending);
      controller?.dispose();
      delete window.SITE_UPDATES;
    };
  }, []);
  return <UpdateMarkup />;
}
