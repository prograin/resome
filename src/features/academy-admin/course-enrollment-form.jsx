import { useState } from "react";
import { MultiSelect } from "../../components/ui/multi-select";
import { RosterForm } from "./course-roster-form";
import { maximumEnrollmentBatch } from "../../lib/course-options";

export function CourseEnrollmentForm({ course, copy, onSaved }) {
  const [selected, setSelected] = useState([]);
  return (
    <RosterForm
      definitionId={course.definition.id}
      operation="enrollMany"
      copy={copy}
      label={copy.enroll}
      onSaved={onSaved}
      dialog
      submitDisabled={!selected.length}
    >
      {(pending) => (
        <MultiSelect
          name="studentIds"
          label={copy.chooseMany}
          value={selected}
          onValueChange={setSelected}
          copy={copy}
          disabled={pending}
          maxSelected={maximumEnrollmentBatch}
          options={course.candidates.map((student) => ({
            value: student.id,
            label: student.name,
            description: student.username,
          }))}
        />
      )}
    </RosterForm>
  );
}
