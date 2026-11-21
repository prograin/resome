import { Workbox } from "workbox-window";
import { academyApp } from "./paths";

let registration;
export function registerAcademyWorker() {
  if (!window.isSecureContext || !("serviceWorker" in navigator)) return Promise.resolve(null);
  if (!registration) {
    registration = new Workbox(academyApp.worker, {
      scope: academyApp.scope,
      updateViaCache: "none",
    })
      .register()
      .catch((error) => {
        registration = null;
        throw error;
      });
  }
  return registration;
}
