import { useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { notificationRequest } from "./api";

export function useNotifications(userId, { readOnView = false } = {}) {
  const [readError, setReadError] = useState(false);
  const [retryVersion, setRetryVersion] = useState(0);
  const readThrough = useRef(0);
  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(
    (index, previous) => {
      if (!userId || (index > 0 && !previous?.nextCursor)) return null;
      return ["academy-notifications", userId, index ? previous.nextCursor : null];
    },
    ([, , cursor]) => notificationRequest(`notifications${cursor ? `?before=${cursor}` : ""}`),
    { refreshInterval: 60000, shouldRetryOnError: false, persistSize: false },
  );
  const latest = data?.[0]?.items[0]?.id;
  const unread = data?.[0]?.unread ?? 0;
  useEffect(() => {
    if (!readOnView || !latest || !unread || readThrough.current === latest) return;
    readThrough.current = latest;
    async function markViewed() {
      try {
        const result = await notificationRequest("notifications", {
          method: "PATCH",
          body: JSON.stringify({ through: latest }),
        });
        await mutate(
          (pages) =>
            pages?.map((page) => ({
              ...page,
              unread: result.unread,
              items: page.items.map((item) =>
                item.id <= latest && !item.readAt ? { ...item, readAt: result.readAt } : item,
              ),
            })),
          { revalidate: false },
        );
        await mutate();
      } catch {
        readThrough.current = 0;
        setReadError(true);
      }
    }
    void markViewed();
  }, [readOnView, latest, unread, retryVersion, mutate]);
  const items = [
    ...new Map((data ?? []).flatMap((page) => page.items).map((item) => [item.id, item])).values(),
  ];
  return {
    items,
    unread,
    error: error || readError,
    loading: isValidating || (!error && (!data || size > data.length)),
    hasMore: Boolean(data?.at(-1)?.nextCursor),
    retry: () => {
      setReadError(false);
      setRetryVersion((value) => value + 1);
      void mutate().catch(() => {});
    },
    loadMore: () => {
      void setSize(size + 1).catch(() => {});
    },
  };
}
