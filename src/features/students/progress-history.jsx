import { Button } from "../../components/ui/button";
import { useDetailsDialog } from "../../components/details-dialog";
import {
  SortableTableHeader,
  TableSortControls,
  useTableSorting,
} from "../../components/ui/sortable-table";

export function ProgressHistory({ history = [], copy, locale }) {
  const { open } = useDetailsDialog();
  const numbers = new Intl.NumberFormat(locale);
  const dates = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "Asia/Tehran" });
  const columns = [
    { key: "number", label: copy.entryNumber, value: (row) => row.registrationNumber },
    { key: "points", label: copy.points, value: (row) => row.points },
    { key: "course", label: copy.course, value: (row) => row.course ?? copy.noCourse },
    { key: "date", label: copy.recordedDate, value: (row) => new Date(row.recordedAt).getTime() },
    { label: copy.description },
  ];
  const data = history.map((row, index) => ({
    ...row,
    registrationNumber: history.length - index,
  }));
  const { rows, sorting, onSort } = useTableSorting(
    data,
    columns,
    { key: "date", direction: "desc" },
    locale,
  );
  return (
    <section className="student-progress__section" aria-label={copy.history}>
      {history.length ? (
        <div className="student-progress__card student-history">
          <TableSortControls
            label={locale === "fa" ? "براساس" : undefined}
            columns={columns}
            sorting={sorting}
            onSort={onSort}
            locale={locale}
          />
          <table className="student-table student-table--stacked student-history__table">
            <SortableTableHeader
              columns={columns}
              sorting={sorting}
              onSort={onSort}
              locale={locale}
            />
            <tbody>
              {rows.map((award) => {
                const date = new Date(award.recordedAt);
                const note = award.note?.trim();
                const registrationNumber = award.registrationNumber;
                const courseName = award.course ?? copy.noCourse;
                return (
                  <tr key={award.id} id={`award-${award.id}`}>
                    <th scope="row" data-label={copy.entryNumber}>
                      <bdi>{numbers.format(registrationNumber)}</bdi>
                    </th>
                    <td data-label={copy.points}>
                      <strong>
                        <bdi>{numbers.format(award.points)}</bdi>
                      </strong>
                    </td>
                    <td data-label={copy.course}>
                      <bdi className="student-history__course" title={courseName}>
                        {courseName}
                      </bdi>
                    </td>
                    <td data-label={copy.recordedDate}>
                      <time dateTime={date.toISOString()}>{dates.format(date)}</time>
                    </td>
                    <td data-label={copy.description}>
                      {note ? (
                        <Button
                          variant="soft"
                          aria-haspopup="dialog"
                          onClick={() =>
                            open({
                              kind: "academy",
                              title: copy.scoreDescription,
                              kicker: `${copy.entryNumber} ${numbers.format(registrationNumber)}`,
                              content: (
                                <p className="student-history__note" dir="auto">
                                  {note}
                                </p>
                              ),
                            })
                          }
                        >
                          {copy.showDescription}
                        </Button>
                      ) : (
                        <span>{copy.noDescription}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>{copy.noHistory}</p>
      )}
    </section>
  );
}
