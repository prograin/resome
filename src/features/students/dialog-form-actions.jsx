"use client";

import { Button } from "../../components/ui/button";
import { useDetailsDialog } from "../../components/details-dialog";
import { usePreferences } from "../../components/preferences";

export function DialogFormActions({
  pending,
  submitLabel,
  variant = "primary",
  submitDisabled = false,
}) {
  const { close } = useDetailsDialog();
  const { locale } = usePreferences();
  return (
    <div className="student-dialog-form-actions">
      <Button type="submit" variant={variant} disabled={pending || submitDisabled}>
        {submitLabel}
      </Button>
      <Button type="button" variant="soft" onClick={close} disabled={pending}>
        {locale === "fa" ? "انصراف" : "Cancel"}
      </Button>
    </div>
  );
}
