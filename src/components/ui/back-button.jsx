"use client";

import { useRouter } from "next/navigation";
import { usePreferences } from "../preferences";
import { Button } from "./button";
import { Icon } from "../icon";

export function BackButton({ fallback, iconOnly = false }) {
  const router = useRouter();
  const { locale, dir } = usePreferences();
  return (
    <Button
      variant="soft"
      dir="ltr"
      aria-label={locale === "fa" ? "بازگشت" : "Back"}
      title={iconOnly ? (locale === "fa" ? "بازگشت" : "Back") : undefined}
      onClick={() => {
        if (window.history.length > 1) router.back();
        else window.location.replace(fallback);
      }}
    >
      <Icon name="arrow-left" />
      {!iconOnly && <span dir={dir}>{locale === "fa" ? "بازگشت" : "Back"}</span>}
    </Button>
  );
}
