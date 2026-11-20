"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { usePreferences } from "./preferences";

const DialogView = dynamic(() => import("./ui/dialog").then((module) => module.DialogView), {
  ssr: false,
});

const DetailsDialog = createContext(null);

export function useDetailsDialog() {
  return useContext(DetailsDialog);
}

export function DetailsDialogProvider({ children }) {
  const { locale, dir } = usePreferences();
  const pathname = usePathname();
  const [entry, setEntry] = useState(null);
  const trigger = useRef(null);
  const active = entry?.pathname === pathname ? entry : null;

  useEffect(() => {
    function closeOnBack() {
      setEntry(null);
    }
    window.addEventListener("popstate", closeOnBack);
    return () => window.removeEventListener("popstate", closeOnBack);
  }, []);

  function open(details) {
    trigger.current = document.activeElement;
    setEntry({ ...details, pathname });
  }

  const close = useCallback(() => {
    setEntry(null);
  }, []);

  return (
    <DetailsDialog.Provider value={{ open, close }}>
      {children}
      {active && (
        <>
          <span hidden data-details-dialog-active />
          <DialogView
            details={active}
            dir={dir}
            closeLabel={locale === "fa" ? "بستن پنجره" : "Close dialog"}
            onClose={close}
            returnFocus={() => trigger.current?.focus({ preventScroll: true })}
          />
        </>
      )}
    </DetailsDialog.Provider>
  );
}
