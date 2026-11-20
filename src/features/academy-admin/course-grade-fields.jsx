export function CourseGradeFields({ copy, rows = 1 }) {
  return (
    <>
      <input
        name="points"
        type="number"
        min={1}
        max={5}
        step={1}
        required
        aria-label={copy.points}
        placeholder={copy.points}
      />
      <textarea
        name="note"
        rows={rows}
        maxLength={500}
        aria-label={copy.note}
        placeholder={copy.note}
      />
    </>
  );
}
