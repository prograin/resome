import {
  SortableTableHeader,
  TableSortControls,
  useTableSorting,
} from "../../components/ui/sortable-table";
import { adminCopy } from "./copy";
import { adminCourseCopy } from "./course-copy";
import { RosterForm } from "./course-roster-form";
import { CourseEnrollmentStatus } from "./course-enrollment-status";
import { CourseGradeButton } from "./course-grade-button";

export function CourseStudentsTable({ course, locale }) {
  const copy = adminCourseCopy[locale];
  const labels = adminCopy[locale];
  const numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const columns = [
    { key: "name", label: labels.name, value: (row) => row.fullName },
    {
      key: "username",
      label: labels.username,
      value: (row) => row.username,
      className: "academy-admin__username-column",
    },
    {
      key: "average",
      label: copy.average,
      value: (row) => (row.average == null ? null : Number(row.average)),
    },
    { key: "rank", label: copy.rank, value: (row) => row.rank },
    { key: "status", label: copy.status, value: (row) => copy[row.status] },
    { label: labels.actions },
  ];
  const data = course.enrollments.map((student) => ({
    ...student,
    fullName: [student.firstName, student.lastName].filter(Boolean).join(" ") || student.name,
  }));
  const { rows, sorting, onSort } = useTableSorting(
    data,
    columns,
    { key: "name", direction: "asc" },
    locale,
  );
  if (!rows.length)
    return <p className="student-progress__card academy-admin__empty">{copy.emptyRoster}</p>;
  return (
    <section
      className="student-progress__card student-progress__section academy-admin__course-table"
      aria-label={copy.manage}
    >
      <TableSortControls
        columns={columns}
        sorting={sorting}
        onSort={onSort}
        locale={locale}
        label={locale === "fa" ? "مرتب‌سازی" : "Sort"}
      />
      <table className="student-table student-table--stacked">
        <SortableTableHeader columns={columns} sorting={sorting} onSort={onSort} locale={locale} />
        <tbody>
          {rows.map((student) => (
            <tr key={student.id}>
              <th scope="row" data-label={labels.name}>
                <bdi>{student.fullName}</bdi>
              </th>
              <td data-label={labels.username} className="academy-admin__username-column">
                <bdi>{student.username}</bdi>
              </td>
              <td data-label={copy.average}>
                {student.average == null ? "—" : numbers.format(Number(student.average))}
              </td>
              <td data-label={copy.rank}>
                {student.rank == null ? "—" : numbers.format(student.rank)}
              </td>
              <td data-label={copy.status}>
                <CourseEnrollmentStatus
                  student={student}
                  definitionId={course.definition.id}
                  copy={copy}
                />
              </td>
              <td data-label={labels.actions} className="academy-admin__actions-cell">
                <div className="academy-admin__course-actions">
                  <RosterForm
                    definitionId={course.definition.id}
                    operation="status"
                    assignmentId={student.id}
                    copy={copy}
                    label={student.status === "completed" ? copy.reactivate : copy.complete}
                    hideSaved
                  >
                    <input
                      type="hidden"
                      name="status"
                      value={student.status === "completed" ? "active" : "completed"}
                    />
                  </RosterForm>
                  <CourseGradeButton
                    student={student}
                    definitionId={course.definition.id}
                    copy={copy}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
