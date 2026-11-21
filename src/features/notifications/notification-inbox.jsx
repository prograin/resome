import { notificationCopy } from "./copy";
import { NotificationList } from "./notification-list";
import { useNotifications } from "./use-notifications";

export function NotificationInbox({ userId, locale }) {
  const notifications = useNotifications(userId, { readOnView: true });
  return (
    <div className="student-notifications-page academy-neo">
      <NotificationList
        notifications={notifications}
        copy={notificationCopy[locale]}
        locale={locale}
      />
    </div>
  );
}
