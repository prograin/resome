import { StudentDirectoryPagination } from "./student-directory-pagination";
import { SiteLink as Link } from "../../components/site-link";
import { Button } from "../../components/ui/button";
import { studentPaths } from "../../lib/student-auth/paths";
import { visibleStudentEmail } from "../../lib/student-auth/student-email";
import { useRouter } from "next/navigation";
import { SortableTableHead, TableSortControls } from "../../components/ui/sortable-table";
import { nextTableSort } from "../../lib/table-sorting";
import { StudentCreateButton } from "./student-create";

export function StudentDirectory({
  directory,
  copy,
  locale,
  basePath = studentPaths.admin,
  showHeader = true,
}) {
  const { students, q, page, pages, sort = "created", direction = "desc" } = directory;
  const router = useRouter();
  const sorting = { key: sort, direction };
  const numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const pageLink = (target) =>
    `${basePath}?${new URLSearchParams({ q, page: String(target), sort, direction })}`;
  const sortLink = (key) =>
    `${basePath}?${new URLSearchParams({ q, sort: key, direction: nextTableSort(sorting, key).direction })}`;
  const columns = [
    { key: "name", label: copy.name },
    { key: "username", label: copy.username },
    { key: "courseCount", label: copy.courseCount },
    { key: "average", label: copy.average },
    { key: "rank", label: copy.rank },
    { label: copy.actions },
  ];
  return (
    <section
      className="student-progress__card student-progress__section academy-admin__directory"
      aria-labelledby={showHeader ? "admin-directory-title" : "student-dashboard-title"}
    >
      {showHeader && (
        <div className="student-progress__header">
          <h2 id="admin-directory-title">{copy.directory}</h2>
          <StudentCreateButton copy={copy} />
        </div>
      )}
      <div className="academy-admin__directory-tools">
        <form method="get" action={basePath} className="student-panel__form academy-admin__search">
          <input type="hidden" name="sort" value={sort} />
          <input type="hidden" name="direction" value={direction} />
          <input
            key={q}
            name="q"
            type="search"
            aria-label={copy.search}
            defaultValue={q}
            placeholder={copy.searchHint}
            maxLength={80}
          />
          <Button type="submit" variant="soft">
            {copy.search}
          </Button>
          {q && (
            <Button as={Link} href={basePath} variant="soft">
              {copy.clear}
            </Button>
          )}
        </form>
        <TableSortControls
          columns={[
            ...columns,
            { key: "created", label: locale === "fa" ? "تاریخ عضویت" : "Join date" },
          ]}
          sorting={sorting}
          onSort={(key) => router.push(sortLink(key))}
          locale={locale}
          mobileOnly={false}
          label={locale === "fa" ? "مرتب‌سازی" : "Sort"}
        />
      </div>
      {students.length ? (
        <>
          <table className="student-table student-table--stacked">
            <thead>
              <tr>
                {columns.map((column) => (
                  <SortableTableHead
                    key={column.label}
                    column={column}
                    sorting={sorting}
                    href={column.key ? sortLink(column.key) : undefined}
                    locale={locale}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <th scope="row" data-label={copy.name}>
                    <span>
                      <bdi>{student.name}</bdi>
                      {visibleStudentEmail(student.email) && (
                        <small>
                          <bdi>{student.email}</bdi>
                        </small>
                      )}
                    </span>
                  </th>
                  <td data-label={copy.username}>
                    <bdi>{student.username}</bdi>
                  </td>
                  <td data-label={copy.courseCount}>{numbers.format(student.courseCount ?? 0)}</td>
                  <td data-label={copy.average}>
                    {student.average == null ? "—" : numbers.format(Number(student.average))}
                  </td>
                  <td data-label={copy.rank}>
                    {student.rank == null ? "—" : numbers.format(student.rank)}
                  </td>
                  <td data-label={copy.actions}>
                    <Button
                      as={Link}
                      variant="soft"
                      href={`${studentPaths.dashboard}?student=${encodeURIComponent(student.id)}`}
                      aria-label={`${copy.manage}: ${student.username}`}
                    >
                      {copy.manage}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="academy-admin__empty">{copy.empty}</p>
      )}
      <StudentDirectoryPagination
        page={page}
        pages={pages}
        pageLink={pageLink}
        copy={copy}
        numbers={numbers}
      />
    </section>
  );
}
