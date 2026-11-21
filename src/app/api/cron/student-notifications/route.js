import { authorizedCron } from "../../../../lib/security/cron-request";
import { getStudentRuntime } from "../../../../lib/student-auth/server";
import { drainNotificationDeliveries } from "../../../../lib/notifications/drain-deliveries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request) {
  if (!authorizedCron(request)) return new Response(null, { status: 401 });
  try {
    const result = await drainNotificationDeliveries(getStudentRuntime().db);
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(
      "Notification retry job failed",
      error.cause?.code ?? error.code ?? "DELIVERY_FAILED",
    );
    return Response.json({ error: "Job unavailable" }, { status: 503 });
  }
}
