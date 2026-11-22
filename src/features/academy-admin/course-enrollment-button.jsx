import { Select } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/icon";
import { useDetailsDialog } from "../../components/details-dialog";
import { adminCourseCopy } from "./course-copy";
import { RosterForm } from "./course-roster-form";

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
            <RosterForm
              definitionId={course.definition.id}
              operation="enroll"
              copy={copy}
              label={copy.enroll}
              onSaved={close}
              dialog
            >
              <label>
                {copy.choose}
                <Select name="studentId" required defaultValue="">
                  <option value="" disabled>
                    {copy.choose}
                  </option>
                  {course.candidates.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </Select>
              </label>
            </RosterForm>
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
