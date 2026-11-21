import { Icon } from "../../components/icon";
import { weeklyChangeClass } from "./weekly-copy";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const trendIcons = {
  positive: "trending-up",
  negative: "trending-down",
  neutral: "move-horizontal",
};

export function WeeklyChange({ change, iconOnly = false, showIcon = true, className = "" }) {
  const icon = trendIcons[change.tone];
  return (
    <span
      className={`student-weekly-change ${weeklyChangeClass[change.tone]} ${className}`}
      title={change.label ?? change.text}
      aria-hidden={iconOnly || undefined}
    >
      {showIcon && icon && <Icon name={icon} className={iconOnly ? "h-5 w-5" : "h-4 w-4"} />}
      {!iconOnly && (
        <>
          <span aria-hidden="true">{change.text}</span>
          <VisuallyHidden>{change.label ?? change.text}</VisuallyHidden>
        </>
      )}
    </span>
  );
}
