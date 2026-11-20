"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Icon } from "./icon";
import { Button } from "./ui/button";

const AcademyMenu = createContext(null);

export function AcademyMenuProvider({ children }) {
  const pathname = usePathname();
  const [openedPath, setOpenedPath] = useState(null);
  const trigger = useRef(null);
  const expanded = openedPath === pathname;

  useEffect(() => {
    if (!expanded) return;
    function dismiss(event) {
      if (event.type === "keydown" && event.key !== "Escape") return;
      if (event.type === "click" && event.target.closest?.("[data-academy-menu]")) return;
      setOpenedPath(null);
      if (event.type === "keydown") trigger.current?.focus({ preventScroll: true });
    }
    document.addEventListener("keydown", dismiss);
    document.addEventListener("click", dismiss);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("click", dismiss);
    };
  }, [expanded]);

  function toggle(event) {
    if (expanded) {
      setOpenedPath(null);
      trigger.current?.focus({ preventScroll: true });
    } else {
      trigger.current = event.currentTarget;
      setOpenedPath(pathname);
    }
  }

  return (
    <AcademyMenu.Provider value={{ expanded, toggle, close: () => setOpenedPath(null) }}>
      {children}
    </AcademyMenu.Provider>
  );
}

export function useAcademyMenu() {
  return useContext(AcademyMenu);
}

export function AcademyDrawerHeader({ openLabel, closeLabel, controls }) {
  const { expanded, toggle } = useAcademyMenu();
  return (
    <div className="student-sidebar__header">
      <Button
        className="student-sidebar__toggle"
        variant="soft"
        aria-label={expanded ? closeLabel : openLabel}
        aria-expanded={expanded}
        aria-controls={controls}
        onClick={toggle}
      >
        <Icon name={expanded ? "x" : "menu"} />
      </Button>
      {expanded && <bdi className="site-wordmark">prograin</bdi>}
    </div>
  );
}
