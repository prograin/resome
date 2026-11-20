import { CourseGradeFields } from "./course-grade-fields";
import { adminCourseCopy } from "./course-copy";
import { RosterForm } from "./course-roster-form";
import { CourseStudentsTable } from "./course-students-table";

export function AdminCourseRoster({ course, locale, gradesOnly }) {
  const copy = adminCourseCopy[locale];
  const { definition, enrollments } = course;
  if (!gradesOnly) return <CourseStudentsTable course={course} locale={locale} />;
  return (
    <div className="student-progress__section">
      {enrollments.length ? (
        <ul className="student-progress__section">
          {enrollments.map((student) => (
            <li
              key={student.id}
              className="student-progress__card student-progress__section academy-admin__roster-row"
              data-view="grades"
            >
              <div className="academy-admin__student-identity">
                <h2>
                  <bdi>
                    {[student.firstName, student.lastName].filter(Boolean).join(" ") ||
                      student.name}
                  </bdi>
                </h2>
                <bdi className="academy-admin__username">{student.username}</bdi>
              </div>
              <RosterForm
                definitionId={definition.id}
                operation="grade"
                assignmentId={student.id}
                copy={copy}
                label={copy.save}
              >
                <CourseGradeFields copy={copy} />
              </RosterForm>
            </li>
          ))}
        </ul>
      ) : (
        <p className="student-progress__card academy-admin__empty">{copy.emptyActive}</p>
      )}
    </div>
  );
}
