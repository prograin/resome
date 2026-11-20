import { SWRConfig } from "swr";
import { Button } from "../../components/ui/button";
import { StudentLinksCards } from "./student-links-cards";
import { studentLinksCopy } from "./student-links-copy";
import { useStudentLinks } from "./use-student-links";

const isolatedCache = () => new Map();

function StudentLinksFeed({ initialPage, locale }) {
  const { students, ref, hasMore, loading, error, loadMore } = useStudentLinks(initialPage);
  const copy = studentLinksCopy[locale];
  return (
    <div className="student-links" aria-busy={loading}>
      <StudentLinksCards students={students} locale={locale} />
      {hasMore && (
        <div ref={ref} className="student-links__load">
          <span role="status">{loading ? copy.loading : null}</span>
          {error && <p role="alert">{copy.failed}</p>}
          <Button variant="soft" disabled={loading} onClick={loadMore}>
            {error ? copy.retry : copy.more}
          </Button>
        </div>
      )}
    </div>
  );
}

export function StudentLinks({ initialPage, locale }) {
  return (
    <SWRConfig key={JSON.stringify(initialPage)} value={{ provider: isolatedCache }}>
      <StudentLinksFeed initialPage={initialPage} locale={locale} />
    </SWRConfig>
  );
}
