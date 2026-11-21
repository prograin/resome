"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

export const AcademyAppContext = createContext({ standalone: false, back: null });
export const useAcademyApp = () => useContext(AcademyAppContext);
export const isStandaloneDisplay = () =>
  window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;

function subscribe(listener) {
  const display = window.matchMedia("(display-mode: standalone)");
  display.addEventListener("change", listener);
  window.addEventListener("pageshow", listener);
  return () => {
    display.removeEventListener("change", listener);
    window.removeEventListener("pageshow", listener);
  };
}

export function useStandaloneDisplay() {
  return useSyncExternalStore(subscribe, isStandaloneDisplay, () => false);
}
