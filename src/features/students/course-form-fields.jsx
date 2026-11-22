import { Select } from "../../components/ui/select";
import { difficultyLevels } from "../../lib/course-options";

export function CourseFormFields({ labels, course }) {
  return (
    <>
      <label>
        {labels.title}
        <input name="title" required maxLength={100} defaultValue={course?.title} dir="auto" />
      </label>
      <label>
        {labels.difficulty}
        <Select name="difficulty" defaultValue={course?.difficulty ?? ""}>
          <option value="">{labels.unknown}</option>
          {difficultyLevels.map((level) => (
            <option key={level} value={level}>
              {labels.levels[level]}
            </option>
          ))}
        </Select>
      </label>
      <label>
        {labels.github}
        <input
          name="github"
          type="url"
          maxLength={2048}
          dir="ltr"
          defaultValue={course?.github ?? ""}
        />
      </label>
      <label>
        {labels.playlist}
        <input
          name="playlist"
          type="url"
          maxLength={2048}
          dir="ltr"
          defaultValue={course?.playlist ?? ""}
        />
      </label>
      <label className="student-course__wide-field">
        {labels.topics}
        <textarea
          name="syllabus"
          rows={4}
          maxLength={6439}
          dir="auto"
          defaultValue={course?.syllabus.join("\n")}
        />
      </label>
    </>
  );
}
