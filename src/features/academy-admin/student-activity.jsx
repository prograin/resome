import { Button } from "../../components/ui/button";
import { Icon } from "../../components/icon";
import { useSavedAction } from "../students/use-saved-action";
import { FormFeedback } from "../students/form-feedback";
import { setStudentActivity } from "./student-activity-actions";
import { adminCopy } from "./copy";

export function StudentActivityButton({ student, locale }) {
  const copy = adminCopy[locale];
  const active = student.academyActive !== false;
  const [status, action, pending] = useSavedAction(setStudentActivity.bind(null, student.id));
  const label =
    locale === "fa"
      ? active
        ? "غیرفعال‌کردن شاگرد"
        : "فعال‌کردن شاگرد"
      : active
        ? "Deactivate student"
        : "Activate student";
  return (
    <form action={action} className="student-panel__form" aria-label={copy.academyStatus}>
      <input type="hidden" name="active" value={String(!active)} />
      <Button type="submit" variant="soft" disabled={pending}>
        <Icon name={active ? "user-x" : "user-check"} />
        {pending ? copy.pending : label}
      </Button>
      <FormFeedback status={status} copy={copy} hideSaved />
    </form>
  );
}
