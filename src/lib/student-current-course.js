export function currentStudentCourse(courses = []) {
  return courses.reduce(
    (latest, course) => (!latest || course.id > latest.id ? course : latest),
    null,
  );
}
