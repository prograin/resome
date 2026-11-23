import { SiteLink as Link } from "../../components/site-link";
import { AcademyDrawerHeader, useAcademyMenu } from "../../components/academy-menu";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/icon";
import { studentPaths } from "../../lib/student-auth/paths";
import { usePreferences } from "../../components/preferences";
import { adminCopy } from "../academy-admin/copy";
import { studentNavigation } from "./student-navigation";
import { notificationCopy } from "../notifications/copy";
import { ThemeToggle } from "../../components/ui/theme-toggle";
import { AcademyBrand } from "../../components/academy-brand";
import { Fragment } from "react";

export function DashboardSidebar({
  copy,
  dir,
  view,
  profileLabel,
  management,
  username,
  statisticsVisible = true,
}) {
  const { expanded, close } = useAcademyMenu();
  const { locale } = usePreferences();
  const links = [
    ...(management
      ? [
          [studentPaths.admin, "briefcase", adminCopy[locale].title, view === "admin"],
          [
            studentPaths.adminStudents,
            "users",
            adminCopy[locale].students,
            view === "admin-directory" || Boolean(management.selected),
          ],
          [
            studentPaths.adminCourses,
            "graduation-cap",
            copy.courses,
            ["admin-courses", "admin-grades", "admin-students"].includes(view),
          ],
          [studentPaths.links, "link", copy.links, view === "links"],
        ]
      : []),
    ...(!management
      ? studentNavigation(copy, null, locale)
          .filter(([, , , target]) => statisticsVisible || !["chart", "history"].includes(target))
          .map(([href, icon, label, target]) => [href, icon, label, view === target])
      : []),
    [studentPaths.notifications, "bell", notificationCopy[locale].title, view === "notifications"],
  ];

  return (
    <aside className="student-sidebar" dir={dir} data-expanded={expanded} data-academy-menu>
      <div className="student-sidebar__anchor">
        <div className="student-sidebar__panel academy-neo">
          <div className="student-sidebar__brand">
            <AcademyBrand dir="rtl" />
          </div>
          <div className="student-sidebar__mobile-header">
            <AcademyDrawerHeader
              openLabel={copy.expandMenu}
              closeLabel={copy.collapseMenu}
              controls="student-dashboard-nav"
            />
          </div>
          <hr className="student-sidebar__divider" />
          <nav id="student-dashboard-nav" aria-label={copy.overview}>
            {links.map(([href, icon, label, current], index) => (
              <Fragment key={href}>
                <Button
                  as={Link}
                  variant="soft"
                  href={href}
                  prefetch={false}
                  aria-current={current ? "page" : undefined}
                  aria-label={label}
                  title={label}
                  onClick={close}
                >
                  <Icon name={icon} />
                  <span>{label}</span>
                </Button>
                {index < links.length - 1 && (
                  <hr className="student-sidebar__divider" aria-hidden="true" />
                )}
              </Fragment>
            ))}
            <div className="student-sidebar__profile">
              <hr className="student-sidebar__divider" />
              <ThemeToggle />
              <hr className="student-sidebar__divider" aria-hidden="true" />
              <Button
                as={Link}
                variant="soft"
                href={studentPaths.profile}
                prefetch={false}
                aria-current={["profile", "password"].includes(view) ? "page" : undefined}
                aria-label={profileLabel}
                title={profileLabel}
                onClick={close}
              >
                <Icon name="user-round" />
                <bdi className="student-sidebar__identity">{username}</bdi>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </aside>
  );
}
