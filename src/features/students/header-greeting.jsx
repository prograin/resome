"use client";

import { studentAuth } from "../../lib/student-auth/client";
import { usePreferences } from "../../components/preferences";

export function HeaderGreeting() {
  const { locale } = usePreferences();
  const { data, isPending } = studentAuth.useSession();
  const username = !isPending && data?.user?.username;
  return (
    <p className="student-shell__greeting" dir={locale === "fa" ? "rtl" : "ltr"}>
      {username && (
        <>
          <span>{locale === "fa" ? "خوش آمدی" : "Welcome"}</span>
          <bdi>{username}</bdi>
        </>
      )}
    </p>
  );
}
