import { getStudentAuth } from "../../../../lib/student-auth/server";
import { validateAuthRequest } from "../../../../lib/security/auth-request";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  const { auth: segments } = await params;
  const endpoint = segments.join("/");
  if (!["sign-in/username", "sign-out", "get-session"].includes(endpoint)) {
    return new Response(null, { status: 404 });
  }
  const validated = await validateAuthRequest(request, endpoint);
  if (validated instanceof Response) return validated;
  const response = await getStudentAuth().handler(validated);
  const retryAfter = response.headers.get("X-Retry-After");
  if (response.status === 429 && retryAfter) response.headers.set("Retry-After", retryAfter);
  return response;
}

export async function GET(request, { params }) {
  const { auth: segments } = await params;
  if (segments.join("/") !== "get-session") return new Response(null, { status: 404 });
  return getStudentAuth().handler(request);
}
