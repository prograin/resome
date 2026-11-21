import { handleAuthRequest } from "../../../../lib/security/auth-handler";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  const { auth: segments } = await params;
  const endpoint = segments.join("/");
  if (!["sign-in/username", "sign-out", "get-session"].includes(endpoint)) {
    return new Response(null, { status: 404 });
  }
  return handleAuthRequest(request, endpoint);
}

export async function GET(request, { params }) {
  const { auth: segments } = await params;
  if (segments.join("/") !== "get-session") return new Response(null, { status: 404 });
  return handleAuthRequest(request, "get-session");
}
