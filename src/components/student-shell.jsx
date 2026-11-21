"use client";

import Image from "next/image";
import { assetUrl } from "../config/assets";
import { SiteLink } from "./site-link";
import { Button } from "./ui/button";
import { Icon } from "./icon";
import { AcademyMobileHeader } from "./academy-mobile-header";
import { usePreferences } from "./preferences";
import { studentPaths } from "../lib/student-auth/paths";
import { BackButton } from "./ui/back-button";
import dynamic from "next/dynamic";
import { useAcademyApp } from "../features/academy-app/app-mode";
import { AcademyInstallButton } from "../features/academy-app/install-button";
import { contact } from "../config/site";

const NotificationBell = dynamic(
  () =>
    import("../features/notifications/notification-bell").then((module) => module.NotificationBell),
  { ssr: false },
);

function StudentBrand() {
  return (
    <SiteLink href={studentPaths.dashboard} className="student-shell__brand" dir="ltr">
      <Image
        unoptimized
        src={assetUrl("/assets/icons/academy/icon-192.png")}
        width={32}
        height={32}
        alt=""
      />
      <span>Prograin Academy</span>
    </SiteLink>
  );
}

export function StudentHeader({ pathname }) {
  const { locale } = usePreferences();
  const fa = locale === "fa";
  const login = pathname.replace(/\/$/, "") === studentPaths.signIn.slice(0, -1);
  const profileLabel = login ? (fa ? "ورود شاگردان" : "Student login") : fa ? "پروفایل" : "Profile";
  return (
    <header className="site-header site-header--academy student-shell__header academy-neo">
      <nav
        className="site-header__standard student-shell__navigation"
        dir="rtl"
        aria-label={fa ? "بخش شاگردان" : "Student area"}
      >
        <StudentBrand />
        <div className="student-shell__links">
          <NotificationBell />
          <Button
            as={SiteLink}
            href={login ? studentPaths.signIn : studentPaths.profile}
            variant="soft"
            aria-label={profileLabel}
            title={profileLabel}
          >
            <Icon name="user-round" />
          </Button>
          <BackButton fallback="/academy/" iconOnly />
        </div>
      </nav>
      <AcademyMobileHeader
        fa={fa}
        pathname={pathname}
        brand={<StudentBrand />}
        notifications={<NotificationBell />}
      />
    </header>
  );
}

export function StudentFooter() {
  const { locale, dir } = usePreferences();
  const { standalone } = useAcademyApp();
  const fa = locale === "fa";
  return (
    <footer id="siteFooter" className="student-shell__footer" dir={dir}>
      <StudentBrand />
      <nav className="student-shell__links" aria-label={fa ? "راهنمای شاگردان" : "Student help"}>
        <SiteLink href={standalone ? studentPaths.dashboard : "/academy/"}>
          {standalone
            ? fa
              ? "داشبورد"
              : "Dashboard"
            : fa
              ? "بازگشت به آکادمی"
              : "Back to academy"}
        </SiteLink>
        <SiteLink
          href={standalone ? `https://t.me/${contact.telegram}` : "/contact/"}
          {...(standalone ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {fa ? "پشتیبانی" : "Support"}
        </SiteLink>
        <AcademyInstallButton />
      </nav>
    </footer>
  );
}
