"use client";

import { useId, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { studentAuth } from "../../lib/student-auth/client";
import { usePreferences } from "../../components/preferences";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/icon";
import { SiteLink } from "../../components/site-link";
import { notificationCopy } from "./copy";
import { studentPaths } from "../../lib/student-auth/paths";
import { NotificationList } from "./notification-list";
import { useNotifications } from "./use-notifications";
import { PushControl } from "./push-control";
import { useWebPush } from "./use-web-push";

function NotificationBellContent({ userId }) {
  const { locale } = usePreferences();
  const copy = notificationCopy[locale === "fa" ? "fa" : "en"];
  const direction = locale === "fa" ? "rtl" : "ltr";
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const notifications = useNotifications(userId);
  const push = useWebPush(userId);
  const number = new Intl.NumberFormat(locale);
  const badge = `${number.format(Math.min(notifications.unread, 99))}${notifications.unread > 99 ? "+" : ""}`;
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          className="student-notifications__bell"
          variant="soft"
          aria-label={`${copy.title}${notifications.unread ? ` ${badge} ${copy.unread}` : ""}`}
        >
          <Icon name="bell" />
          {notifications.unread > 0 && (
            <span className="student-notifications__badge" aria-hidden="true">
              {badge}
            </span>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="student-notifications academy-neo"
          dir={direction}
          align="end"
          sideOffset={12}
          collisionPadding={12}
          aria-labelledby={titleId}
        >
          <div className="student-notifications__heading">
            <h2 id={titleId}>{copy.title}</h2>
            <Popover.Close asChild>
              <Button variant="soft" aria-label={copy.close}>
                <Icon name="x" />
              </Button>
            </Popover.Close>
          </div>
          <NotificationList
            notifications={notifications}
            copy={copy}
            locale={locale}
            preview
            onNavigate={() => setOpen(false)}
          />
          <div className="student-notifications__actions">
            <Button
              as={SiteLink}
              href={studentPaths.notifications}
              variant="soft"
              onClick={() => setOpen(false)}
            >
              {copy.all}
              <Icon name={locale === "fa" ? "chevron-left" : "chevron-right"} />
            </Button>
            <PushControl push={push} copy={copy} />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function NotificationBell() {
  const { data, isPending } = studentAuth.useSession();
  return !isPending && data?.user ? (
    <NotificationBellContent key={data.user.id} userId={data.user.id} />
  ) : null;
}
