import { AdminCourseButton } from "./course-dialog-button";
import { Button } from "../../components/ui/button";
import { SiteLink as Link } from "../../components/site-link";
import { studentPaths } from "../../lib/student-auth/paths";
import { adminCourseCopy } from "./course-copy";

export function AdminCourseCatalog({ courses, locale }) {
  const copy = adminCourseCopy[locale];
  const numbers = new Intl.NumberFormat(locale);
  return (
    <div className="student-progress__section">
      {courses.length ? (
        <ul className="student-progress__grid academy-admin__catalog">
          {courses.map((course) => (
            <li
              key={course.id}
              id={`course-${course.id}`}
              className="student-progress__card academy-admin__course"
            >
              <div className="academy-admin__course-heading">
                <h2>
                  <bdi>{course.title}</bdi>
                </h2>
                <AdminCourseButton course={course} locale={locale} iconOnly />
              </div>
              <p className="academy-admin__course-stats">
                <span>
                  {numbers.format(course.active)} {copy.activeCount}
                </span>
                <span>
                  {numbers.format(course.completed)} {copy.completedCount}
                </span>
              </p>
              <div className="student-course__links">
                <Button
                  as={Link}
                  variant="soft"
                  href={`${studentPaths.adminCourses}${course.id}/grades/`}
                >
                  {copy.grades}
                </Button>
                <Button
                  as={Link}
                  variant="soft"
                  href={`${studentPaths.adminCourses}${course.id}/students/`}
                >
                  {copy.students}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>{copy.empty}</p>
      )}
    </div>
  );
}
