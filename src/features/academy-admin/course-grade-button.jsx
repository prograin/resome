import { Button } from "../../components/ui/button";
import { useDetailsDialog } from "../../components/details-dialog";
import { RosterForm } from "./course-roster-form";
import { CourseGradeFields } from "./course-grade-fields";
import { canRecordStudentScores } from "../../lib/student-account";
import { ScoreTodayTag } from "./score-today-tag";

export function CourseGradeButton({ student, definitionId, copy }) {
  const { open, close } = useDetailsDialog();
  return (
    <Button
      variant="soft"
      disabled={student.status !== "active" || !canRecordStudentScores(student)}
      title={!canRecordStudentScores(student) ? copy.scoringDisabled : undefined}
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
              <ScoreTodayTag recorded={student.scoredToday} copy={copy} />
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
