import { Button } from "../../components/ui/button";
import { useDetailsDialog } from "../../components/details-dialog";
import { adminCourseCopy } from "./course-copy";
import { courseCopy } from "../students/course-copy";
import { AdminCourseEditor } from "./course-editor";
import { AdminCourseVideos } from "./course-videos";
import { Icon } from "../../components/icon";

export function AdminCourseButton({ course, locale, iconOnly = false }) {
  const copy = adminCourseCopy[locale];
  const labels = courseCopy[locale];
  const { open, close } = useDetailsDialog();
  const title = course ? labels.edit : copy.add;
  return (
    <Button
      variant="soft"
      className={
        iconOnly ? (course ? "academy-admin__course-edit" : "academy-admin__course-add") : undefined
      }
      aria-label={iconOnly ? title : undefined}
      title={iconOnly ? title : undefined}
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
      {iconOnly ? <Icon name={course ? "pencil" : "plus"} /> : title}
    </Button>
  );
}
