import { useState } from "react";
import { matchesSearchText } from "../../lib/search-text";
import { CourseGradeFields } from "./course-grade-fields";
import { adminCourseCopy } from "./course-copy";
import { RosterForm } from "./course-roster-form";
import { CourseStudentsTable } from "./course-students-table";
import { ScoreTodayTag } from "./score-today-tag";

export function AdminCourseRoster({ course, locale, gradesOnly }) {
  const [query, setQuery] = useState("");
  const copy = adminCourseCopy[locale];
  const { definition, enrollments } = course;
  const matches = (student) =>
    matchesSearchText(
      [student.firstName, student.lastName].filter(Boolean).join(" ") || student.name,
      query,
    );
  if (!gradesOnly) return <CourseStudentsTable course={course} locale={locale} />;
  return (
    <div className="student-progress__section">
      {enrollments.length > 0 && (
        <div className="student-progress__card student-panel__form">
          <input
            type="search"
            aria-label={copy.filterName}
            placeholder={copy.filterName}
            value={query}
            maxLength={100}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      )}
      {enrollments.length > 0 && !enrollments.some(matches) && (
        <p className="student-progress__card academy-admin__empty" role="status">
          {copy.noMatches}
        </p>
      )}
      {enrollments.length ? (
        <ul className="student-progress__section">
          {enrollments.map((student) => (
            <li
              key={student.id}
              hidden={!matches(student)}
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
                <ScoreTodayTag recorded={student.scoredToday} copy={copy} />
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
