"use client";

import { useEffect } from "react";
import { version } from "../config/assets";
import { createUpdateController } from "./update-controller";
import { UpdateMarkup } from "./update-markup";

export function SiteUpdates() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    const controller = createUpdateController(version);
    controller.init();
    window.SITE_UPDATES = controller;
    return () => {
      controller.dispose();
      delete window.SITE_UPDATES;
    };
  }, []);
  return <UpdateMarkup />;
}
