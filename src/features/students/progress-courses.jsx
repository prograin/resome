import { useDetailsDialog } from "../../components/details-dialog";
import { Button } from "../../components/ui/button";
import {
  CourseResourceIcon,
  CourseLink,
  CourseButtonLabel,
  CourseVideos,
  CourseSyllabus,
} from "./course-resources";
import { CourseContentForm } from "./course-content-form";
import { courseCopy } from "./course-copy";

const difficultyClass = {
  beginner: "student-course--beginner",
  intermediate: "student-course--intermediate",
  advanced: "student-course--advanced",
};

function CourseCard({ course, labels, copy, numbers, studentId }) {
  const { open, close } = useDetailsDialog();
  function show(title, content) {
    open({ kind: "academy", title, kicker: course.title, content });
  }
  const editor = (operation) => (
    <CourseContentForm
      studentId={studentId}
      course={course}
      operation={operation}
      labels={labels}
      copy={copy}
      onSaved={close}
    />
  );
  return (
    <li
      className={`student-course student-progress__card student-progress__section ${difficultyClass[course.difficulty] ?? ""}`}
    >
      <h2>
        <bdi>{course.title}</bdi>
      </h2>
      <p className="student-course__difficulty">
        {labels.difficulty} <span>{labels.levels[course.difficulty] ?? labels.unknown}</span>
      </p>
      <p>
        {labels.yourPoints}:{" "}
        <strong>
          <bdi>{course.average == null ? "—" : numbers.format(Number(course.average))}</bdi>
        </strong>
      </p>
      <p>
        {labels.yourRank}:{" "}
        <strong>
          <bdi>{course.rank ? numbers.format(BigInt(course.rank)) : "—"}</bdi>
        </strong>
      </p>
      <div className="student-course__links">
        {course.github && (
          <CourseLink href={course.github} icon="github">
            {labels.github}
          </CourseLink>
        )}
        {course.playlist && (
          <CourseLink href={course.playlist} icon="youtube">
            <CourseButtonLabel full={labels.playlist} short={labels.playlistShort} />
          </CourseLink>
        )}
        <Button
          variant="soft"
          aria-haspopup="dialog"
          onClick={() =>
            show(labels.videos, <CourseVideos videos={course.videos} labels={labels} />)
          }
        >
          <CourseButtonLabel full={labels.videos} short={labels.videosShort} />
          <CourseResourceIcon name="videos" />
        </Button>
        <Button
          variant="soft"
          aria-haspopup="dialog"
          onClick={() =>
            show(labels.syllabus, <CourseSyllabus syllabus={course.syllabus} labels={labels} />)
          }
        >
          {labels.syllabus}
          <CourseResourceIcon name="syllabus" />
        </Button>
      </div>
      {studentId && (
        <div className="student-course__links">
          <Button
            variant="soft"
            aria-haspopup="dialog"
            onClick={() => show(labels.edit, editor("course"))}
          >
            {labels.edit}
          </Button>
          <Button
            variant="soft"
            aria-haspopup="dialog"
            onClick={() => show(labels.addVideo, editor("video"))}
          >
            {labels.addVideo}
          </Button>
        </div>
      )}
    </li>
  );
}

export function ProgressCourses({ courses, copy, locale, studentId }) {
  const numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  if (!courses.length) return <p>{copy.noCourses}</p>;

  return (
    <ul className="student-progress__grid" aria-label={copy.courses}>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          labels={courseCopy[locale]}
          copy={copy}
          numbers={numbers}
          studentId={studentId}
        />
      ))}
    </ul>
  );
}
