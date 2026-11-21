import { z } from "zod";
import { getStudentRuntime } from "../student-auth/server.js";
import { validateAuthRequest } from "./auth-request.js";
import { trustedRequestOrigin } from "./request-origin.js";
import { limitBackendRequest } from "./request-limit.js";
import { apiJson } from "./api-response.js";
import { parseQuery } from "../validation/forms.js";
import { serviceDiagnostic } from "./service-diagnostic.js";

const flag = z.enum(["true", "false"]).optional();
const sessionQuery = z.strictObject({ disableCookieCache: flag, disableRefresh: flag });

export async function handleAuthRequest(request, endpoint) {
  if (request.method !== "GET" && !trustedRequestOrigin(request))
    return apiJson({ error: "Forbidden origin" }, 403);
  try {
    const runtime = getStudentRuntime();
    const limited = await limitBackendRequest(
      request,
      runtime.limits,
      endpoint === "sign-in/username" ? "loginRequest" : "authRequest",
    );
    if (limited) return limited;
    if (
      !parseQuery(
        endpoint === "get-session" ? sessionQuery : z.strictObject({}),
        new URL(request.url).searchParams,
      )
    )
      return apiJson({ error: "Invalid query" }, 400);
    const validated =
      request.method === "GET" ? request : await validateAuthRequest(request, endpoint);
    if (validated instanceof Response) return validated;
    const response = await runtime.auth.handler(validated);
    response.headers.set("Cache-Control", "private, no-store");
    const retryAfter = response.headers.get("X-Retry-After");
    if (response.status === 429 && retryAfter) response.headers.set("Retry-After", retryAfter);
    return response;
  } catch (error) {
    console.error("Authentication unavailable", serviceDiagnostic(error));
    return apiJson({ error: "Service unavailable" }, 503, { "Retry-After": "5" });
  }
}
