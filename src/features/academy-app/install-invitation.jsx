import { useEffect } from "react";
import Image from "next/image";
import { assetUrl } from "../../config/assets";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/icon";
import { useDetailsDialog } from "../../components/details-dialog";
import { isStandaloneDisplay } from "./app-mode";
import { academyApp } from "./paths";

const key = academyApp.invitationKey;
const installedKey = "prograin-academy-installed";
let shown = false;

export function rememberInstallation() {
  try {
    localStorage.setItem(installedKey, "1");
  } catch {
    /* Storage may be unavailable. */
  }
}

export function rememberInstallInvitation() {
  shown = true;
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    /* Keep the in-memory session flag. */
  }
}

function alreadyInvited() {
  try {
    return (
      shown || sessionStorage.getItem(key) === "1" || localStorage.getItem(installedKey) === "1"
    );
  } catch {
    return shown;
  }
}

function InvitationContent({ fa, install, close }) {
  return (
    <div className="academy-install-invite">
      <Image
        unoptimized
        src={assetUrl("/assets/icons/academy/icon-192.png")}
        width={72}
        height={72}
        alt=""
      />
      <p>
        {fa
          ? "نسخهٔ وب‌اپ Prograin Academy آمادهٔ نصب است. آن را به صفحهٔ اصلی دستگاهتان اضافه کنید تا سریع‌تر به داشبورد، دوره‌ها و هدف‌هایتان دسترسی داشته باشید."
          : "The Prograin Academy web app is ready to install. Add it to your home screen for quick access to your dashboard, courses and goals."}
      </p>
      <div className="academy-install-invite__actions">
        <Button variant="primary" onClick={install}>
          <Icon name="download" />
          {fa ? "نصب آکادمی" : "Install academy"}
        </Button>
        <Button variant="soft" onClick={close}>
          {fa ? "فعلاً نه" : "Not now"}
        </Button>
      </div>
    </div>
  );
}

export function useInstallInvitation({ standalone, installed, fa, install }) {
  const { open, close } = useDetailsDialog();
  useEffect(() => {
    if (standalone || installed || isStandaloneDisplay() || alreadyInvited()) return;
    const present = () => {
      if (
        alreadyInvited() ||
        isStandaloneDisplay() ||
        document.hidden ||
        document.activeElement?.closest("form") ||
        document.querySelector(
          '[data-details-dialog-active], [role="dialog"][data-state="open"], dialog[open], form[aria-busy="true"]',
        )
      )
        return;
      rememberInstallInvitation();
      open({
        kind: "academy",
        title: fa ? "آکادمی را همراه خود داشته باشید" : "Keep your academy close",
        content: <InvitationContent fa={fa} install={install} close={close} />,
      });
    };
    let timer = setTimeout(present, 1500);
    const resume = () => {
      if (document.hidden) return;
      clearTimeout(timer);
      timer = setTimeout(present, 1500);
    };
    document.addEventListener("visibilitychange", resume);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [standalone, installed, fa, install, open, close]);
}
