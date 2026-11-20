import { Button } from "../../components/ui/button";
import { useDetailsDialog } from "../../components/details-dialog";
import { adminCourseCopy } from "./course-copy";
import { courseCopy } from "../students/course-copy";
import { AdminCourseEditor } from "./course-editor";
import { AdminCourseVideos } from "./course-videos";

export function AdminCourseButton({ course, locale }) {
  const copy = adminCourseCopy[locale];
  const labels = courseCopy[locale];
  const { open, close } = useDetailsDialog();
  const title = course ? labels.edit : copy.add;
  return (
    <Button
      variant="soft"
      aria-haspopup="dialog"
      onClick={() =>
        open({
          kind: "academy",
          title,
          content: (
            <div className="student-progress__section">
              <AdminCourseEditor course={course} copy={copy} locale={locale} onSaved={close} />
              {course && (
                <section className="student-progress__section" aria-label={labels.videos}>
                  <h3>{labels.videos}</h3>
                  <AdminCourseVideos course={course} copy={copy} locale={locale} />
                </section>
              )}
            </div>
          ),
        })
      }
    >
      {title}
    </Button>
  );
}
