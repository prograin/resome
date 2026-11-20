import { adminCopy } from "./copy";
import { StudentDirectory } from "./student-directory";
import { studentPaths } from "../../lib/student-auth/paths";

export function AcademyAdminOverview({ directory, locale, studentsOnly = false }) {
  const copy = adminCopy[locale];
  const numbers = new Intl.NumberFormat(locale);
  return (
    <div className="student-progress__section academy-admin">
      {!studentsOnly && (
        <div className="student-chart__metrics">
          {Object.entries(directory.summary).map(([key, value]) => (
            <div key={key} className="student-progress__card student-chart__average">
              <p>{copy[key]}</p>
              <bdi className="student-chart__average-value">{numbers.format(value)}</bdi>
            </div>
          ))}
        </div>
      )}
      <StudentDirectory
        directory={directory}
        copy={copy}
        locale={locale}
        basePath={studentsOnly ? studentPaths.adminStudents : studentPaths.admin}
        showHeader={!studentsOnly}
      />
    </div>
  );
}
