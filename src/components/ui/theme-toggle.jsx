"use client";

import { usePreferences } from "../preferences";
import { Icon } from "../icon";
import { Button } from "./button";

export function ThemeToggle({ iconOnly = false, ...props }) {
  const { locale, theme, toggleTheme } = usePreferences();
  const light = theme === "dark";
  const label =
    locale === "fa" ? (light ? "حالت روشن" : "حالت تیره") : light ? "Light mode" : "Dark mode";
  return (
    <Button variant="soft" {...props} onClick={toggleTheme} aria-label={label} title={label}>
      <Icon name={light ? "sun" : "moon"} />
      {!iconOnly && <span>{label}</span>}
    </Button>
  );
}
