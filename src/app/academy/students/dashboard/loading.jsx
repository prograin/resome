"use client";

import { PageFrame } from "../../../../components/page-frame";
import { usePreferences } from "../../../../components/preferences";
import { dashboardCopy } from "../../../../features/students/dashboard-copy";

export default function DashboardLoading() {
  const { locale } = usePreferences();
  return (
    <PageFrame page="academy-dashboard">
      <section className="student-panel student-dashboard-status academy-neo" aria-busy="true">
        <p role="status">{dashboardCopy[locale].loading}</p>
      </section>
    </PageFrame>
  );
}
