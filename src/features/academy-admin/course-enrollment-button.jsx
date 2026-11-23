import { Button } from "../../components/ui/button";
import { Icon } from "../../components/icon";
import { useDetailsDialog } from "../../components/details-dialog";
import { adminCourseCopy } from "./course-copy";
import { CourseEnrollmentForm } from "./course-enrollment-form";

export function CourseEnrollmentButton({ course, locale }) {
  const copy = adminCourseCopy[locale];
  const { open, close } = useDetailsDialog();
  return (
    <Button
      variant="soft"
      dir="ltr"
      aria-haspopup="dialog"
      onClick={() =>
        open({
          kind: "academy",
          title: copy.enroll,
          content: course.candidates.length ? (
            <CourseEnrollmentForm course={course} copy={copy} onSaved={close} />
          ) : (
            <p>{copy.noCandidates}</p>
          ),
        })
      }
    >
      <Icon name="plus" />
      <span dir="auto">{copy.enroll}</span>
    </Button>
  );
}
