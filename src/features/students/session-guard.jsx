"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { studentAuth } from "../../lib/student-auth/client";
import { studentPaths } from "../../lib/student-auth/paths";
import { useDetailsDialog } from "../../components/details-dialog";
import {
  canRecordStudentScores,
  isStudentBanned,
  isAccountBannedError,
} from "../../lib/student-account";

export function SessionGuard({ userId, children, statisticsVisible = true }) {
  const { data, isPending, isRefetching, error, refetch } = studentAuth.useSession();
  const router = useRouter();
  const { close } = useDetailsDialog();
  const wrongUser = Boolean(data && data.user.id !== userId);
  const changedUser = wrongUser && !isPending && !isRefetching;
  const changedActivity = Boolean(data && canRecordStudentScores(data.user) !== statisticsVisible);
  const banned = isStudentBanned(data?.user) || isAccountBannedError(error);
  const signedOut = !isPending && ((!error && !data) || error?.status === 401);
  useEffect(() => {
    if (!signedOut && !changedUser && !changedActivity && !banned) return;
    close();
    if (banned) router.replace(`${studentPaths.signIn}?notice=banned`);
    else if (signedOut) router.replace(studentPaths.signIn);
    else if (changedActivity)
      void refetch()
        .then(() => router.refresh())
        .catch(() => {});
    else router.refresh();
  }, [signedOut, changedUser, changedActivity, banned, router, close, refetch]);
  return signedOut || wrongUser || changedActivity || banned ? null : children;
}
