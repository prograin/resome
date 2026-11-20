import { useState } from "react";
import { weeklyChange, weeklyCopy } from "./weekly-copy";
import { WeeklyChange } from "./weekly-change";
import { SortableTableHead, useTableSorting } from "../../components/ui/sortable-table";

const podiumMedals = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function WeeklyLeaderboard({ weekly, locale }) {
  const [hasMore, setHasMore] = useState(true);
  const copy = weeklyCopy[locale];
  const numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const leaders = weekly?.leaders ?? [];
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
    <section className="student-progress__card student-weekly-leaders">
      <h2>{copy.leaders}</h2>
      {leaders.length ? (
        <div
          className={`student-weekly-leaders__scroll${hasMore ? " student-weekly-leaders__scroll--more" : ""}`}
          onScroll={({ currentTarget }) =>
            setHasMore(
              Math.abs(currentTarget.scrollLeft) + currentTarget.clientWidth <
                currentTarget.scrollWidth - 1,
            )
          }
          role="region"
          aria-label={copy.leaders}
          tabIndex={0}
        >
          <table className="student-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <SortableTableHead
                    key={column.label}
                    column={column}
                    sorting={sorting}
                    onSort={onSort}
                    locale={locale}
                  />
                ))}
              </tr>
            </thead>
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
                      <WeeklyChange change={change} />
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
    </section>
  );
}
