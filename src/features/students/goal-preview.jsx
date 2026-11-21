import { useState } from "react";
import { useDetailsDialog } from "../../components/details-dialog";
import { Button } from "../../components/ui/button";
import { Icon } from "../../components/icon";
import { GoalDetails } from "./goal-details";
import { GoalForm } from "./goal-form";
import { goalCopy } from "./goal-copy";

function GoalPreview({ goal, copy, locale, canEdit }) {
  const [editing, setEditing] = useState(false);
  const { close } = useDetailsDialog();
  const labels = goalCopy[locale];
  return editing ? (
    <GoalForm goal={goal} labels={labels} copy={copy} locale={locale} onSaved={close} />
  ) : (
    <GoalDetails
      goal={goal}
      labels={labels}
      locale={locale}
      full
      showTitle={false}
      actions={
        canEdit && (
          <Button
            variant="soft"
            className="student-goal__action"
            aria-label={labels.edit}
            title={labels.edit}
            onClick={() => setEditing(true)}
          >
            <Icon name="pencil" />
          </Button>
        )
      }
    />
  );
}

export function GoalPreviewButton({ goal, copy, locale, canEdit, label }) {
  const { open } = useDetailsDialog();
  return (
    <Button
      variant="soft"
      aria-label={`${label}: ${goal.title}`}
      aria-haspopup="dialog"
      onClick={() =>
        open({
          kind: "academy",
          title: goal.title.trim(),
          content: (
            <GoalPreview key={goal.id} goal={goal} copy={copy} locale={locale} canEdit={canEdit} />
          ),
        })
      }
    >
      {label}
    </Button>
  );
}
