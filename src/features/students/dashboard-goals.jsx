import { SiteLink as Link } from "../../components/site-link";
import { Button } from "../../components/ui/button";
import { studentPaths } from "../../lib/student-auth/paths";
import { goalCopy } from "./goal-copy";
import { dashboardCopy } from "./dashboard-copy";
import { GoalProgress } from "./goal-progress";
import { GoalDialogButton } from "./student-goals";
import {
  SortableTableHead,
  TableSortControls,
  useTableSorting,
} from "../../components/ui/sortable-table";

const priorityClass = {
  1: "student-goal-priority--high",
  2: "student-goal-priority--medium",
  3: "student-goal-priority--low",
};

export function DashboardGoals({
  goals = [],
  locale,
  query = "",
  formCopy,
  canCreate,
  limit,
  embedded = false,
}) {
  const copy = goalCopy[locale];
  const labels = dashboardCopy[locale];
  const percentages = new Intl.NumberFormat(locale, { style: "percent" });
  const href = studentPaths.goals + query;
  const columns = [
    { key: "title", label: copy.title, value: (row) => row.title },
    { key: "priority", label: copy.priority, value: (row) => row.priority },
    { key: "progress", label: copy.progress, value: (row) => row.studentPercent },
    { label: labels.actions },
  ];
  const { rows, sorting, onSort } = useTableSorting(
    goals,
    columns,
    { key: "priority", direction: "asc" },
    locale,
  );
  return (
    <section className="student-dashboard-goals" aria-label={formCopy.goals}>
      <div className={embedded ? undefined : "student-progress__card"}>
        <div className="student-dashboard-goals__content">
          {goals.length ? (
            <>
              <TableSortControls
                label={locale === "fa" ? "براساس" : undefined}
                columns={columns}
                sorting={sorting}
                onSort={onSort}
                locale={locale}
              />
              <table className="student-table student-table--stacked student-summary__table">
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
                  {(limit == null ? rows : rows.slice(0, limit)).map((goal) => (
                    <tr key={goal.id} className={priorityClass[goal.priority]}>
                      <th scope="row" data-label={copy.title}>
                        <bdi>{goal.title.trim()}</bdi>
                      </th>
                      <td data-label={copy.priority}>
                        <span className="student-goal-priority">
                          {copy.priorities[goal.priority - 1]}
                        </span>
                      </td>
                      <td data-label={copy.progress}>
                        <GoalProgress
                          label={copy.progress}
                          value={goal.studentPercent}
                          percentages={percentages}
                          compact
                        />
                      </td>
                      <td data-label={labels.actions}>
                        <Button
                          as={Link}
                          href={`${href}#goal-${goal.id}`}
                          prefetch={false}
                          variant="soft"
                          aria-label={`${labels.view}: ${goal.title}`}
                        >
                          {labels.view}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div className="student-dashboard-goals__empty">
              <p>{copy.empty}</p>
              {canCreate && (
                <GoalDialogButton copy={formCopy} locale={locale} text={copy.addForTracking} />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
