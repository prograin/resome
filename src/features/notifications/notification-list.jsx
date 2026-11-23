import { Button } from "../../components/ui/button";
import { SiteLink } from "../../components/site-link";
import { dashboardHref } from "./api";
import { studentAuth } from "../../lib/student-auth/client";

export function NotificationList({ notifications, copy, locale, preview = false, onNavigate }) {
  const { data } = studentAuth.useSession();
  const statisticsVisible = data?.user?.academyActive !== false;
  const number = new Intl.NumberFormat(locale);
  const items = preview ? notifications.items.slice(0, 5) : notifications.items;
  return (
    <div className="student-notifications__list" aria-busy={notifications.loading}>
      {!items.length && !notifications.error && (
        <p role="status">{notifications.loading ? copy.loading : copy.empty}</p>
      )}
      <ul>
        {items.map((item, index) => {
          const href = dashboardHref(item.href);
          if (!href) return null;
          return (
            <li key={item.id}>
              <SiteLink
                href={href}
                className="student-notifications__item"
                data-unread={!item.readAt}
                onClick={onNavigate}
              >
                <strong>{copy[item.kind]}</strong>
                {!item.readAt && (
                  <span
                    className="student-notifications__dot"
                    role="img"
                    aria-label={copy.unread}
                  />
                )}
                {statisticsVisible && item.points !== null && (
                  <span>
                    {number.format(item.points)} {copy.points}
                  </span>
                )}
                {item.courseTitle && <span>{item.courseTitle}</span>}
                <time dateTime={item.createdAt}>
                  {new Date(item.createdAt).toLocaleDateString(
                    locale === "fa" ? "fa-IR" : "en-US",
                    { timeZone: "Asia/Tehran" },
                  )}
                </time>
              </SiteLink>
              {!preview && index < items.length - 1 && (
                <hr className="student-notifications__separator" />
              )}
            </li>
          );
        })}
      </ul>
      {notifications.error && (
        <div role="alert">
          <p>{copy.error}</p>
          <Button variant="soft" onClick={notifications.retry}>
            {copy.retry}
          </Button>
        </div>
      )}
      {!preview && notifications.hasMore && (
        <Button variant="soft" disabled={notifications.loading} onClick={notifications.loadMore}>
          {notifications.loading ? copy.loading : copy.more}
        </Button>
      )}
    </div>
  );
}
