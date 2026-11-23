"use client";

import Image from "next/image";
import { SiteLink as Link } from "./site-link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { assetUrl } from "../config/assets";
import { Button } from "./ui/button";
import { Icon } from "./icon";
import { usePreferences } from "./preferences";
import { AcademyMobileHeader } from "./academy-mobile-header";
import { StudentHeader } from "./student-shell";
import { studentPaths } from "../lib/student-auth/paths";
import { BackButton } from "./ui/back-button";

const pages = [
  ["Home", "/", "خانه", "Home"],
  ["Academy", "/academy/", "آکادمی", "Academy"],
  ["Order", "/order/", "پروژه", "Order project"],
  ["Contact", "/contact/", "تماس با ما", "Contact"],
];

const normalize = (path) => path.replace(/\/$/, "") || "/";

export function Header() {
  const { locale, toggleLocale } = usePreferences();
  const pathname = usePathname();
  const academy = pathname === "/academy" || pathname.startsWith("/academy/");
  const [openedPath, setOpenedPath] = useState(null);
  const open = openedPath === pathname;
  const mobileButton = useRef(null);
  const header = useRef(null);
  const fa = locale === "fa";

  useEffect(() => {
    if (!open) return;
    function dismiss(event) {
      if (event.type === "keydown" && event.key !== "Escape") return;
      if (event.type === "click" && header.current?.contains(event.target)) return;
      setOpenedPath(null);
      if (event.type === "keydown") mobileButton.current?.focus();
    }
    document.addEventListener("keydown", dismiss);
    document.addEventListener("click", dismiss);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("click", dismiss);
    };
  }, [open]);

  if (
    normalize(pathname).startsWith(studentPaths.signIn.slice(0, -1) + "/") ||
    normalize(pathname) === studentPaths.signIn.slice(0, -1)
  ) {
    return <StudentHeader pathname={pathname} />;
  }

  function links(mobile) {
    return pages.map(([id, href, persian, english]) => (
      <Link
        prefetch={false}
        key={id}
        href={href}
        id={`${mobile ? "mNav" : "nav"}${id}Page`}
        data-page-link={id === "Contact" ? "contact-page" : id.toLowerCase()}
        aria-current={
          normalize(pathname) === normalize(href) ||
          (href === "/" && normalize(pathname) === "/home")
            ? "page"
            : undefined
        }
        className={
          mobile
            ? "rounded-xl px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900"
            : "hover:text-slate-900 dark:hover:text-white"
        }
        onClick={() => setOpenedPath(null)}
      >
        {fa ? persian : english}
      </Link>
    ));
  }

  return (
    <header
      ref={header}
      className={`site-header ${academy ? "site-header--academy" : ""} z-50 border-b border-cyan-100/80 bg-white/80 backdrop-blur-xl dark:border-cyan-950/70 dark:bg-slate-950/75`}
    >
      <nav
        dir={academy ? "rtl" : undefined}
        className="site-header__standard mx-auto flex min-h-20 max-w-6xl items-center justify-between px-4 py-2.5 sm:min-h-16 sm:py-3"
      >
        <Link
          prefetch={false}
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <Image
            unoptimized
            id="navName"
            className="h-11 w-11 rounded-full object-cover shadow-sm sm:h-10 sm:w-10"
            src={assetUrl("/assets/icons/favicon-48.png")}
            width={48}
            height={48}
            alt="Prograin"
          />
          <span className="site-wordmark" dir="ltr">
            prograin<span>.</span>
          </span>
        </Link>
        <div className="site-page-links hidden items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          {links(false)}
        </div>
        <div className="flex items-center gap-2">
          <Button
            id="langToggle"
            type="button"
            aria-label={fa ? "تغییر زبان" : "Toggle language"}
            onClick={toggleLocale}
          >
            <Icon name="languages" className="h-4 w-4" />
            <span className="hidden sm:inline" id="langToggleText">
              {fa ? "EN" : "FA"}
            </span>
          </Button>
          <Button
            ref={mobileButton}
            id="mobileMenuBtn"
            type="button"
            aria-label={fa ? "منو" : "Menu"}
            aria-expanded={open}
            aria-controls="mobileMenu"
            onClick={() => setOpenedPath(open ? null : pathname)}
          >
            <Icon name="menu" className="h-4 w-4" />
          </Button>
          {academy && (
            <BackButton
              fallback={normalize(pathname) === "/academy" ? "/" : "/academy/"}
              iconOnly
            />
          )}
        </div>
      </nav>
      {academy && <AcademyMobileHeader fa={fa} pathname={pathname} />}
      <div
        id="mobileMenu"
        className={`${open ? "" : "hidden"} border-t border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 md:hidden`}
      >
        <div className="site-page-links grid grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-200">
          {links(true)}
        </div>
      </div>
    </header>
  );
}
