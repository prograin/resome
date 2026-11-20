import { Button } from "../../components/ui/button";
import { useDetailsDialog } from "../../components/details-dialog";
import { RosterForm } from "./course-roster-form";
import { CourseGradeFields } from "./course-grade-fields";

export function CourseGradeButton({ student, definitionId, copy }) {
  const { open, close } = useDetailsDialog();
  return (
    <Button
      variant="soft"
      disabled={student.status !== "active"}
      aria-haspopup="dialog"
      onClick={() =>
        open({
          kind: "academy",
          title: copy.grades,
          kicker: student.fullName,
          content: (
            <RosterForm
              definitionId={definitionId}
              operation="grade"
              assignmentId={student.id}
              copy={copy}
              label={copy.save}
              onSaved={close}
              dialog
            >
              <CourseGradeFields copy={copy} rows={3} />
            </RosterForm>
          ),
        })
      }
    >
      {copy.gradeStudent}
    </Button>
  );
}
