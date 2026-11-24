import { useEffect, useRef, useState } from "react";
import { weeklyChange, weeklyCopy } from "./weekly-copy";
import { WeeklyChange } from "./weekly-change";
import { SortableTableHeader, useTableSorting } from "../../components/ui/sortable-table";

const podiumMedals = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function LeaderboardTable({ leaders = [], locale }) {
  const [hasMore, setHasMore] = useState(false);
  const scroll = useRef(null);
  useEffect(() => {
    const node = scroll.current;
    if (!node) return;
    const update = () =>
      setHasMore(node.scrollWidth - node.clientWidth - Math.abs(node.scrollLeft) > 1);
    const observer = new ResizeObserver(update);
    observer.observe(node);
    observer.observe(node.firstElementChild);
    node.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      node.removeEventListener("scroll", update);
    };
  }, [leaders.length]);
  const copy = weeklyCopy[locale];
  const numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const columns = [
    { key: "rank", label: copy.rank, value: (row) => row.overallRank },
    { key: "username", label: copy.username, value: (row) => row.username },
    {
      key: "average",
      label: copy.average,
      value: (row) => (row.average == null ? null : Number(row.average)),
    },
    {
      key: "change",
      label: copy.change,
      value: (row) =>
        row.previousRank == null ? null : Number(row.previousRank) - Number(row.overallRank),
    },
  ];
  const { rows, sorting, onSort } = useTableSorting(
    leaders,
    columns,
    { key: "rank", direction: "asc" },
    locale,
  );
  return (
    <>
      {leaders.length ? (
        <div
          ref={scroll}
          className={`student-weekly-leaders__scroll${hasMore ? " student-weekly-leaders__scroll--more" : ""}`}
          role="region"
          aria-label={copy.leaders}
          tabIndex={0}
        >
          <table className="student-table">
            <SortableTableHeader
              columns={columns}
              sorting={sorting}
              onSort={onSort}
              locale={locale}
            />
            <tbody>
              {rows.map((student) => {
                const rank = Number(student.overallRank);
                const medal = podiumMedals[rank];
                const change = weeklyChange(
                  student.overallRank,
                  student.previousRank,
                  "rank",
                  locale,
                  true,
                );
                return (
                  <tr key={student.username}>
                    <td>
                      <span className="student-weekly-leaders__rank">
                        <bdi>{numbers.format(rank)}</bdi>
                        {medal && (
                          <span role="img" aria-label={copy.medals[rank - 1]}>
                            {medal}
                          </span>
                        )}
                      </span>
                    </td>
                    <td>
                      <bdi>{student.username}</bdi>
                    </td>
                    <td>
                      {student.average == null ? "—" : numbers.format(Number(student.average))}
                    </td>
                    <td>
                      <WeeklyChange change={change} className="student-weekly-change--compact" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>{copy.empty}</p>
      )}
    </>
  );
}
