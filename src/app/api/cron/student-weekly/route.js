import { timingSafeEqual } from "node:crypto";
import { getStudentRuntime } from "../../../../lib/student-auth/server";
import { adminUsername } from "../../../../lib/student-progress";
import { captureWeeklyStats } from "../../../../lib/student-weekly";
import { clearExpiredSecurityRecords } from "../../../../lib/security/cleanup";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  const supplied = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (
    !z.string().min(32).safeParse(secret).success ||
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    return new Response(null, { status: 401 });
  }
  try {
    const { db } = getStudentRuntime();
    const result = await captureWeeklyStats(db, adminUsername());
    await clearExpiredSecurityRecords(db);
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Student weekly job failed", error.cause?.code ?? error.code);
    return Response.json({ error: "Job unavailable" }, { status: 503 });
  }
}
