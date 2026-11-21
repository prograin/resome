import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionCookie } from "better-auth/cookies";
import { studentPaths } from "./paths";
import { getStudentAuth } from "./server";
import { cache } from "react";
import { studentAuthPolicy } from "./config";
import { notificationReturnTo } from "../notifications/targets";

export const readStudentSession = cache(async () => {
  const requestHeaders = await headers();
  if (!getSessionCookie(requestHeaders, { cookiePrefix: studentAuthPolicy.cookiePrefix }))
    return null;
  return getStudentAuth().api.getSession({
    headers: requestHeaders,
    query: { disableRefresh: true },
  });
});

export async function requireStudentSession(returnTo) {
  const session = await readStudentSession();
  if (!session) {
    const target = notificationReturnTo(returnTo);
    redirect(
      target ? `${studentPaths.signIn}?next=${encodeURIComponent(target)}` : studentPaths.signIn,
    );
  }
  return session;
}
