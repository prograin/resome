import { revalidatePath } from "next/cache";
import { getStudentRuntime } from "../../../../lib/student-auth/server";
import { adminUsername } from "../../../../lib/student-progress";
import { studentPaths } from "../../../../lib/student-auth/paths";
import { deactivateIdleStudents } from "../../../../lib/student-inactivity";
import { authorizedCron } from "../../../../lib/security/cron-request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!authorizedCron(request)) return new Response(null, { status: 401 });
  try {
    const result = await deactivateIdleStudents(getStudentRuntime().db, adminUsername());
    if (result.deactivated) revalidatePath(studentPaths.dashboard, "layout");
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Student inactivity job failed", error.cause?.code ?? error.code);
    return Response.json({ error: "Job unavailable" }, { status: 503 });
  }
}
