import Image from "next/image";
import { Button } from "../../components/ui/button";
import { assetUrl } from "../../config/assets";

export function CourseResourceIcon({ name }) {
  return (
    <Image
      unoptimized
      className="student-course__icon"
      data-course-icon={name}
      src={assetUrl(`/assets/icons/courses/${name}.webp`)}
      alt=""
      width={28}
      height={28}
    />
  );
}

export function CourseLink({ href, icon, children }) {
  return (
    <Button as="a" variant="soft" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <CourseResourceIcon name={icon} />
    </Button>
  );
}

export function CourseButtonLabel({ full, short }) {
  return (
    <>
      <span className="student-course__label-full">{full}</span>
      <span className="student-course__label-short">{short}</span>
    </>
  );
}

export function CourseVideos({ videos, labels }) {
  if (!videos.length) return <p>{labels.noVideos}</p>;
  return (
    <ul className="student-progress__section">
      {videos.map(({ id, title, description, url }) => (
        <li key={id} className="academy-inset student-course__video">
          <h3 dir="auto">{title}</h3>
          <p dir="auto">{description}</p>
          <CourseLink href={url} icon="videos">
            {labels.watch}
          </CourseLink>
        </li>
      ))}
    </ul>
  );
}

export function CourseSyllabus({ syllabus, labels }) {
  return (
    <div className="student-course__syllabus-content">
      {syllabus.length ? (
        <ol className="academy-inset student-course__syllabus">
          {syllabus.map((topic, index) => (
            <li key={index}>
              <bdi>{topic}</bdi>
            </li>
          ))}
        </ol>
      ) : (
        <p>{labels.noTopics}</p>
      )}
    </div>
  );
}
