import { ICONS } from "./icon-paths";
export function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-lucide={name}
      data-rendered-icon={name}
      className={className}
      dangerouslySetInnerHTML={{ __html: ICONS[name] || ICONS.circle }}
    />
  );
}
