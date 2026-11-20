"use client";

import { PageFrame } from "../../../../components/page-frame";
import { usePreferences } from "../../../../components/preferences";
import { Button } from "../../../../components/ui/button";
import { dashboardCopy } from "../../../../features/students/dashboard-copy";

export default function DashboardError({ reset }) {
  const { locale } = usePreferences();
  const copy = dashboardCopy[locale];
  return (
    <PageFrame page="academy-dashboard">
      <section className="student-panel student-dashboard-status academy-neo">
        <p role="alert">{copy.error}</p>
        <Button variant="soft" onClick={reset}>
          {copy.retry}
        </Button>
      </section>
    </PageFrame>
  );
}
