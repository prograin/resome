import { useCallback, useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import { useInView } from "react-intersection-observer";
import { loadStudentLinks } from "./student-links-actions";

export function useStudentLinks(initialPage) {
  const { data, size, setSize, isValidating, error, mutate } = useSWRInfinite(
    (index, previous) => {
      if (index === 0) return ["student-links", null];
      return previous?.nextCursor ? ["student-links", previous.nextCursor] : null;
    },
    ([, cursor]) => loadStudentLinks(cursor),
    {
      fallbackData: [initialPage],
      revalidateFirstPage: false,
      revalidateOnMount: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );
  const pages = data ?? [initialPage];
  const hasMore = Boolean(pages.at(-1)?.nextCursor);
  const loading = isValidating || (!error && size > pages.length);
  const { ref, inView } = useInView({ rootMargin: "160px" });
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    void (error ? mutate() : setSize((count) => count + 1)).catch(() => {});
  }, [loading, hasMore, error, mutate, setSize]);
  useEffect(() => {
    if (inView && !error) loadMore();
  }, [inView, error, loadMore]);
  const students = [
    ...new Map(
      pages.flatMap((page) => page.students).map((student) => [student.username, student]),
    ).values(),
  ];
  return { students, ref, hasMore, loading, error, loadMore };
}
