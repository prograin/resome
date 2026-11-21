import { Icon as LucideIcon } from "lucide-react";
import { getIconNode } from "./icon-nodes";
export function Icon({ name, className = "h-5 w-5" }) {
  const node = getIconNode(name).map(([tag, attributes], key) => [tag, { ...attributes, key }]);
  return (
    <LucideIcon
      icon={{ name, node }}
      aria-hidden="true"
      data-lucide={name}
      data-rendered-icon={name}
      className={className}
    />
  );
}
