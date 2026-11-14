"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createIcons } from "../local-icons";
import { Icon } from "./icon";
import { usePreferences } from "./preferences";

const Dialog = createContext(null);

export function useDetailsDialog() {
  return useContext(Dialog);
}

export function DetailsDialogProvider({ children }) {
  const { locale } = usePreferences();
  const pathname = usePathname();
  const [entry, setEntry] = useState(null);
  const active = entry?.pathname === pathname ? entry : null;
  const closeButton = useRef(null);
  const body = useRef(null);

  useEffect(() => {
    if (!active) return;
    const background = [...document.querySelectorAll(".site-header, .site-main, #siteFooter")];
    background.forEach((element) => {
      element.inert = true;
    });
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
    body.current.scrollTop = 0;
    if (active.htmlBody) createIcons(body.current);
    closeButton.current.focus({ preventScroll: true });
    function keydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setEntry(null);
      }
      if (event.key !== "Tab") return;
      const controls = [
        closeButton.current,
        body.current,
        ...body.current.querySelectorAll(
          "a[href], button, input, select, textarea, [tabindex='0']",
        ),
      ].filter((element) => element && !element.disabled && element.getClientRects().length);
      const target = event.shiftKey ? controls[0] : controls.at(-1);
      if (document.activeElement === target) {
        event.preventDefault();
        (event.shiftKey ? controls.at(-1) : controls[0])?.focus();
      }
    }
    function closeOnBack() {
      setEntry(null);
    }
    document.addEventListener("keydown", keydown);
    window.addEventListener("popstate", closeOnBack);
    return () => {
      document.removeEventListener("keydown", keydown);
      window.removeEventListener("popstate", closeOnBack);
      background.forEach((element) => {
        element.inert = false;
      });
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      active.trigger?.focus({ preventScroll: true });
    };
  }, [active]);

  function open(details) {
    setEntry({ ...details, pathname, trigger: document.activeElement });
  }
  function close() {
    setEntry(null);
  }

  return (
    <Dialog.Provider value={{ open, close, body }}>
      {children}
      <div
        id="modalOverlay"
        data-kind={active?.kind}
        aria-hidden={!active}
        className={`fixed inset-0 z-[60] ${active ? "flex" : "hidden"} items-center justify-center bg-black/60 p-4`}
      >
        <button
          className="absolute inset-0"
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={close}
        />
        <div
          id="modalDialog"
          className="relative w-full max-w-3xl overflow-hidden rounded-5xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div className="min-w-0">
              <p
                id="modalKicker"
                className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              >
                {active?.kicker}
              </p>
              <h3
                id="modalTitle"
                className="truncate text-base font-semibold text-slate-900 dark:text-slate-50"
              >
                {active?.title}
              </h3>
            </div>
            <button
              ref={closeButton}
              id="modalCloseBtn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              type="button"
              aria-label={locale === "fa" ? "بستن پنجره" : "Close dialog"}
              onClick={close}
            >
              <Icon name="x" />
            </button>
          </div>
          <div
            ref={body}
            id="modalBody"
            className="max-h-[78vh] overflow-auto px-5 py-5"
            tabIndex={0}
            role="region"
            aria-labelledby="modalTitle"
          >
            {active?.htmlBody ? (
              <div dangerouslySetInnerHTML={{ __html: active.htmlBody }} />
            ) : (
              active?.content
            )}
          </div>
        </div>
      </div>
    </Dialog.Provider>
  );
}
