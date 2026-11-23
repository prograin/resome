"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { isAcademyAppPath } from "../features/academy-app/paths";

const Preferences = createContext(null);

function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

const listeners = new Set();
const overrides = {};
const localeKey = "portfolio_locale";
const themeKey = "academy_theme";

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readLocale() {
  return (overrides[localeKey] ?? read(localeKey)) === "en" ? "en" : "fa";
}

function readTheme() {
  return (overrides[themeKey] ?? read(themeKey)) === "dark" ? "dark" : "light";
}

export function PreferencesProvider({ children }) {
  const pathname = usePathname();
  const academy = isAcademyAppPath(pathname);
  const locale = useSyncExternalStore(subscribe, readLocale, () => "fa");
  const theme = useSyncExternalStore(
    subscribe,
    () => (academy ? readTheme() : "dark"),
    () => (academy ? "light" : "dark"),
  );

  const dir = locale === "fa" ? "rtl" : "ltr";
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("rtl", dir === "rtl");
  }, [locale, dir, theme]);

  function save(key, value) {
    try {
      localStorage.setItem(key, value);
      delete overrides[key];
    } catch {
      overrides[key] = value;
    }
    listeners.forEach((listener) => listener());
  }

  function toggleLocale() {
    const next = locale === "fa" ? "en" : "fa";
    save(localeKey, next);
  }

  function toggleTheme() {
    if (!academy) return;
    const next = theme === "dark" ? "light" : "dark";
    save(themeKey, next);
  }

  return (
    <Preferences.Provider value={{ locale, dir, theme, toggleLocale, toggleTheme }}>
      {children}
    </Preferences.Provider>
  );
}

export function usePreferences() {
  return useContext(Preferences);
}
