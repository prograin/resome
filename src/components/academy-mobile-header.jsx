import { SiteLink as Link } from "./site-link";
import { routes } from "../config/site";
import { studentPaths } from "../lib/student-auth/paths";
import { AcademyDrawerHeader, useAcademyMenu } from "./academy-menu";
import { Icon } from "./icon";
import { Button } from "./ui/button";
import { BackButton } from "./ui/back-button";

export function AcademyMobileHeader({ fa, pathname, brand }) {
  const { expanded, toggle, close } = useAcademyMenu();
  const dashboard =
    pathname.startsWith(studentPaths.dashboard) || pathname === studentPaths.dashboard.slice(0, -1);
  const menuLabel = fa ? "منوی آکادمی" : "Academy menu";
  const links = [
    [routes.academy.path, "graduation-cap", fa ? "آکادمی" : "Academy"],
    [routes["academy-consultation"].path, "lightbulb", fa ? "مشاوره" : "Consultation"],
    [studentPaths.dashboard, "layout", fa ? "داشبورد شاگردان" : "Student dashboard"],
  ];

  return (
    <>
      <nav className="academy-mobile-header" aria-label={fa ? "نوار آکادمی" : "Academy navigation"}>
        <Button
          id="academyMenuButton"
          data-academy-menu
          variant="soft"
          aria-label={menuLabel}
          aria-expanded={expanded}
          aria-controls={dashboard ? "student-dashboard-nav" : "academy-mobile-menu"}
          onClick={toggle}
        >
          <Icon name={expanded ? "x" : "menu"} />
        </Button>
        {brand ?? (
          <Link prefetch={false} href={routes.academy.path} className="site-wordmark" dir="ltr">
            prograin<span>.</span>
          </Link>
        )}
        <BackButton
          fallback={pathname.replace(/\/$/, "") === "/academy" ? "/" : routes.academy.path}
          iconOnly
        />
      </nav>
      {!dashboard && (
        <nav
          id="academy-mobile-menu"
          className="academy-mobile-menu academy-neo"
          data-academy-menu
          data-expanded={expanded}
          aria-label={menuLabel}
          hidden={!expanded}
        >
          <AcademyDrawerHeader
            openLabel={menuLabel}
            closeLabel={fa ? "بستن منوی آکادمی" : "Close academy menu"}
            controls="academy-mobile-menu"
          />
          <hr className="student-sidebar__divider" />
          {links.map(([href, icon, label]) => (
            <Button
              as={Link}
              variant="soft"
              href={href}
              prefetch={false}
              key={href}
              onClick={close}
              aria-current={pathname === href ? "page" : undefined}
            >
              <Icon name={icon} />
              {label}
            </Button>
          ))}
        </nav>
      )}
    </>
  );
}
