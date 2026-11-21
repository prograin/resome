import { z } from "zod";
import {
  authorizeStudentApi,
  studentApiBody,
  studentApiJson,
} from "../../../../lib/security/student-api";
import {
  pushRegistrationInput,
  pushUnsubscribeInput,
} from "../../../../lib/validation/notifications";
import { deleteStudentPush, saveStudentPush } from "../../../../lib/db/student-push";

export const runtime = "nodejs";

export async function GET(request) {
  const access = await authorizeStudentApi(request, "notificationsRead");
  if (access instanceof Response) return access;
  const valid =
    process.env.VAPID_PRIVATE_KEY &&
    process.env.VAPID_SUBJECT &&
    z
      .string()
      .regex(/^[a-zA-Z0-9_-]{87}$/)
      .safeParse(process.env.VAPID_PUBLIC_KEY).success;
  return studentApiJson({ publicKey: valid ? process.env.VAPID_PUBLIC_KEY : null });
}

async function changeSubscription(request, remove) {
  const access = await authorizeStudentApi(request, "push");
  if (access instanceof Response) return access;
  const body = await studentApiBody(request, remove ? pushUnsubscribeInput : pushRegistrationInput);
  if (body instanceof Response) return body;
  if (!remove && body.studentId && body.studentId !== access.user.id)
    return studentApiJson({ error: "Account changed" }, 403);
  try {
    if (remove) {
      await deleteStudentPush(access.db, access.user.id, body.endpoint);
      return studentApiJson({ ok: true });
    }
    const saved = await saveStudentPush(access.db, access.user.id, body);
    return studentApiJson({ ok: saved }, saved ? 200 : 429);
  } catch (error) {
    console.error(
      "Push subscription update failed",
      error.cause?.code ?? error.code ?? "PUSH_SUBSCRIPTION_FAILED",
    );
    return studentApiJson({ error: "Service unavailable" }, 503);
  }
}

export const POST = (request) => changeSubscription(request, false);
export const DELETE = (request) => changeSubscription(request, true);
