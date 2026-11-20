import { SiteLink as Link } from "../../components/site-link";
import { AcademyDrawerHeader, useAcademyMenu } from "../../components/academy-menu";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/icon";
import { studentPaths } from "../../lib/student-auth/paths";
import { usePreferences } from "../../components/preferences";
import { adminCopy } from "../academy-admin/copy";
import { studentNavigation } from "./student-navigation";

export function DashboardSidebar({ copy, dir, view, profileLabel, management, username }) {
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
        ]
      : []),
    ...(!management
      ? studentNavigation(copy, null, locale).map(([href, icon, label, target]) => [
          href,
          icon,
          label,
          view === target,
        ])
      : []),
  ];

  return (
    <aside
      className="student-sidebar"
      dir={dir}
      data-expanded={expanded}
      data-academy-menu
      style={{ "--student-sidebar-items": links.length + 2 }}
    >
      <div className="student-sidebar__anchor">
        <div className="student-sidebar__panel academy-neo">
          <AcademyDrawerHeader
            openLabel={copy.expandMenu}
            closeLabel={copy.collapseMenu}
            controls="student-dashboard-nav"
          />
          {expanded && <hr className="student-sidebar__divider" />}
          <nav id="student-dashboard-nav" aria-label={copy.overview}>
            {links.map(([href, icon, label, current]) => (
              <Button
                as={Link}
                variant="soft"
                key={href}
                href={href}
                prefetch={false}
                aria-current={current ? "page" : undefined}
                aria-label={label}
                title={label}
                onClick={close}
              >
                <Icon name={icon} />
                {expanded && <span>{label}</span>}
              </Button>
            ))}
            <div className="student-sidebar__profile">
              <hr className="student-sidebar__divider" />
              <Button
                as={Link}
                variant="soft"
                href={studentPaths.profile}
                prefetch={false}
                aria-current={view === "profile" ? "page" : undefined}
                aria-label={profileLabel}
                title={profileLabel}
                onClick={close}
              >
                <Icon name="user-round" />
                {expanded && <bdi className="student-sidebar__identity">{username}</bdi>}
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </aside>
  );
}
