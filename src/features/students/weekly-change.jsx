import { Icon } from "../../components/icon";
import { weeklyChangeClass } from "./weekly-copy";

const trendIcons = {
  positive: "trending-up",
  negative: "trending-down",
  neutral: "move-horizontal",
};

export function WeeklyChange({ change }) {
  const icon = trendIcons[change.tone];
  return (
    <span
      className={`student-weekly-change ${weeklyChangeClass[change.tone]}`}
      title={change.label ?? change.text}
    >
      {icon && <Icon name={icon} className="h-4 w-4" />}
      <span>{change.text}</span>
    </span>
  );
}
