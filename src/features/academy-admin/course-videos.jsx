import { Button } from "../../components/ui/button";
import { useDetailsDialog } from "../../components/details-dialog";
import { courseCopy } from "../students/course-copy";
import { AdminVideoEditor } from "./course-editor";

export function AdminCourseVideos({ course, copy, locale }) {
  const { open, close } = useDetailsDialog();
  const labels = courseCopy[locale];
  function edit(video) {
    open({
      kind: "academy",
      title: video ? copy.editVideo : labels.addVideo,
      kicker: course.title,
      content: (
        <AdminVideoEditor
          definitionId={course.id}
          video={video}
          copy={copy}
          locale={locale}
          onSaved={close}
        />
      ),
    });
  }
  return (
    <div className="student-progress__section">
      <div className="student-course__actions">
        <Button variant="soft" aria-haspopup="dialog" onClick={() => edit()}>
          {labels.addVideo}
        </Button>
      </div>
      {course.videos.length ? (
        <ul className="student-progress__section">
          {course.videos.map((video) => (
            <li key={video.id} className="academy-inset academy-admin__video">
              <h3>
                <bdi>{video.title}</bdi>
              </h3>
              <p dir="auto">{video.description}</p>
              <div className="student-course__links">
                <Button
                  as="a"
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="soft"
                >
                  {labels.watch}
                </Button>
                <Button variant="soft" aria-haspopup="dialog" onClick={() => edit(video)}>
                  {copy.editVideo}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>{labels.noVideos}</p>
      )}
    </div>
  );
}
