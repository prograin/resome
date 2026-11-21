"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/icon";
import { usePreferences } from "../../components/preferences";
import { useDetailsDialog } from "../../components/details-dialog";
import { useAcademyApp } from "./app-mode";
import {
  useInstallInvitation,
  rememberInstallInvitation,
  rememberInstallation,
} from "./install-invitation";

export function AcademyInstallButton() {
  const { standalone } = useAcademyApp();
  const { locale } = usePreferences();
  const { open, close } = useDetailsDialog();
  const prompt = useRef(null);
  const [installed, setInstalled] = useState(false);
  const fa = locale === "fa";
  const label = fa ? "نصب آکادمی" : "Install academy";
  useEffect(() => {
    const available = (event) => {
      event.preventDefault();
      prompt.current = event;
    };
    const complete = () => {
      setInstalled(true);
      prompt.current = null;
      rememberInstallation();
      if (document.querySelector(".academy-install-invite, .academy-install-guide")) close();
    };
    window.addEventListener("beforeinstallprompt", available);
    window.addEventListener("appinstalled", complete);
    return () => {
      window.removeEventListener("beforeinstallprompt", available);
      window.removeEventListener("appinstalled", complete);
    };
  }, [close]);
  useInstallInvitation({ standalone, installed, fa, install });
  async function install() {
    rememberInstallInvitation();
    close();
    const invitation = prompt.current;
    if (invitation) {
      try {
        await invitation.prompt();
        await invitation.userChoice;
        prompt.current = null;
        return;
      } catch {
        prompt.current = null;
      }
    }
    open({
      kind: "academy",
      title: label,
      content: (
        <div className="academy-install-guide">
          <p>
            {fa
              ? "آکادمی را روی صفحهٔ اصلی دستگاه نصب کنید تا مستقیم به ورود و داشبوردتان دسترسی داشته باشید."
              : "Install the academy on your device for direct access to sign-in and your dashboard."}
          </p>
          <ol>
            <li>
              {fa
                ? "در Chrome یا Edge، منوی سه‌نقطه را باز کنید و Install app یا Add to Home screen را انتخاب کنید؛ سپس Install را بزنید."
                : "In Chrome or Edge, open the browser menu and select Install app or Add to home screen."}
            </li>
            <li>
              {fa
                ? "در آیفون و آیپد، این صفحه را در Safari باز کنید؛ سپس Share و بعد Add to Home Screen را بزنید و با Add تأیید کنید."
                : "On iPhone or iPad, open this page in Safari, then choose Share → Add to Home Screen."}
            </li>
          </ol>
        </div>
      ),
    });
  }
  if (standalone || installed) return null;
  return (
    <Button variant="soft" onClick={install} className="academy-install-button">
      <Icon name="download" />
      {label}
    </Button>
  );
}
