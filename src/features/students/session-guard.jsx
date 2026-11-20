"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { studentAuth } from "../../lib/student-auth/client";
import { studentPaths } from "../../lib/student-auth/paths";
import { useDetailsDialog } from "../../components/details-dialog";

export function SessionGuard({ userId, children }) {
  const { data, isPending, isRefetching, error } = studentAuth.useSession();
  const router = useRouter();
  const { close } = useDetailsDialog();
  const wrongUser = Boolean(data && data.user.id !== userId);
  const changedUser = wrongUser && !isPending && !isRefetching;
  const signedOut = !isPending && ((!error && !data) || error?.status === 401);
  useEffect(() => {
    if (!signedOut && !changedUser) return;
    close();
    if (signedOut) router.replace(studentPaths.signIn);
    else router.refresh();
  }, [signedOut, changedUser, router, close]);
  return signedOut || wrongUser ? null : children;
}
