"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { studentAuth } from "../../lib/student-auth/client";
import { studentPaths } from "../../lib/student-auth/paths";
import { useDetailsDialog } from "../../components/details-dialog";

export function SessionGuard({ userId, children, statisticsVisible = true }) {
  const { data, isPending, isRefetching, error, refetch } = studentAuth.useSession();
  const router = useRouter();
  const { close } = useDetailsDialog();
  const wrongUser = Boolean(data && data.user.id !== userId);
  const changedUser = wrongUser && !isPending && !isRefetching;
  const changedActivity = Boolean(
    data && (data.user.academyActive !== false) !== statisticsVisible,
  );
  const signedOut = !isPending && ((!error && !data) || error?.status === 401);
  useEffect(() => {
    if (!signedOut && !changedUser && !changedActivity) return;
    close();
    if (signedOut) router.replace(studentPaths.signIn);
    else if (changedActivity)
      void refetch()
        .then(() => router.refresh())
        .catch(() => {});
    else router.refresh();
  }, [signedOut, changedUser, changedActivity, router, close, refetch]);
  return signedOut || wrongUser || changedActivity ? null : children;
}
