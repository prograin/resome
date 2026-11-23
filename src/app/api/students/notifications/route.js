import {
  authorizeStudentApi,
  studentApiBody,
  studentApiJson,
} from "../../../../lib/security/student-api";
import {
  notificationQueryInput,
  notificationReadInput,
} from "../../../../lib/validation/notifications";
import {
  readStudentNotifications,
  markStudentNotificationRead,
  markStudentNotificationsRead,
} from "../../../../lib/db/student-notifications";
import { parseQuery } from "../../../../lib/validation/forms";

export const runtime = "nodejs";

export async function GET(request) {
  const access = await authorizeStudentApi(request, "notificationsRead");
  if (access instanceof Response) return access;
  const parsed = parseQuery(notificationQueryInput, new URL(request.url).searchParams);
  if (!parsed) return studentApiJson({ error: "Invalid cursor" }, 400);
  const result = await readStudentNotifications(access.db, access.user.id, parsed.before);
  if (access.user.academyActive === false)
    result.items = result.items.map((item) => ({ ...item, points: null }));
  return studentApiJson(result);
}

export async function PATCH(request) {
  const access = await authorizeStudentApi(request, "notificationsWrite");
  if (access instanceof Response) return access;
  const body = await studentApiBody(request, notificationReadInput);
  if (body instanceof Response) return body;
  if (body.through)
    return studentApiJson(
      await markStudentNotificationsRead(access.db, access.user.id, body.through),
    );
  const saved = await markStudentNotificationRead(access.db, access.user.id, body.id);
  return studentApiJson({ ok: saved }, saved ? 200 : 404);
}
