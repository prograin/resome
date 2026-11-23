import {
  SortableTableHeader,
  TableSortControls,
  useTableSorting,
} from "../../components/ui/sortable-table";
import { CourseEnrollmentStatus } from "./course-enrollment-status";
import { adminCourseCopy } from "./course-copy";

export function StudentCoursesTable({ courses, locale }) {
  const copy = adminCourseCopy[locale];
  const title = locale === "fa" ? "دوره‌های شاگرد" : "Student courses";
  const numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const columns = [
    { key: "title", label: copy.courseName, value: (course) => course.title },
    {
      key: "average",
      label: copy.average,
      value: (course) => (course.average == null ? null : Number(course.average)),
    },
    { key: "rank", label: copy.rank, value: (course) => course.rank },
    { key: "status", label: copy.status, value: (course) => copy[course.status] },
  ];
  const { rows, sorting, onSort } = useTableSorting(
    courses,
    columns,
    { key: "title", direction: "asc" },
    locale,
  );
  const format = (value) => (value == null ? "—" : numbers.format(Number(value)));
  return (
    <section
      className="student-progress__card student-progress__section academy-admin__course-table"
      aria-label={title}
      data-student-courses
    >
      <h2>{title}</h2>
      {rows.length ? (
        <>
          <TableSortControls
            columns={columns}
            sorting={sorting}
            onSort={onSort}
            locale={locale}
            label={locale === "fa" ? "مرتب‌سازی" : "Sort"}
          />
          <table className="student-table student-table--stacked">
            <SortableTableHeader
              columns={columns}
              sorting={sorting}
              onSort={onSort}
              locale={locale}
            />
            <tbody>
              {rows.map((course) => (
                <tr key={course.id} data-student-course-id={course.id}>
                  <th scope="row" data-label={copy.courseName}>
                    <bdi>{course.title}</bdi>
                  </th>
                  <td data-label={copy.average}>{format(course.average)}</td>
                  <td data-label={copy.rank}>{format(course.rank)}</td>
                  <td data-label={copy.status}>
                    <CourseEnrollmentStatus
                      student={{ id: course.id, status: course.status, fullName: course.title }}
                      definitionId={course.definitionId}
                      copy={copy}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>
          {locale === "fa"
            ? "هنوز دوره‌ای برای این شاگرد ثبت نشده است."
            : "No courses have been assigned to this student yet."}
        </p>
      )}
    </section>
  );
}
