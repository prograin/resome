import { getSessionCookie } from "better-auth/cookies";
import { getStudentRuntime } from "../student-auth/server.js";
import { studentAuthPolicy } from "../student-auth/config.js";
import { consumeRateLimit } from "./mutation-limit.js";
import { apiJson, rateLimitResponse } from "./api-response.js";
import { trustedRequestOrigin } from "./request-origin.js";
import { limitBackendRequest } from "./request-limit.js";
import { serviceDiagnostic } from "./service-diagnostic.js";
import { isStudentBanned } from "../student-account.js";
import { bannedAccountResponse } from "./account-response.js";

export { apiJson as studentApiJson } from "./api-response.js";
export { readJsonRequest as studentApiBody } from "./json-request.js";

export async function authorizeStudentApi(request, scope) {
  if (request.method !== "GET" && !trustedRequestOrigin(request))
    return apiJson({ error: "Forbidden origin" }, 403);
  try {
    const runtime = getStudentRuntime();
    const requestLimit = await limitBackendRequest(request, runtime.limits, "apiRequest");
    if (requestLimit) return requestLimit;
    if (!getSessionCookie(request.headers, { cookiePrefix: studentAuthPolicy.cookiePrefix }))
      return apiJson({ error: "Unauthorized" }, 401);
    const session = await runtime.auth.api.getSession({
      headers: request.headers,
      query: { disableRefresh: true },
    });
    if (!session) return apiJson({ error: "Unauthorized" }, 401);
    if (isStudentBanned(session.user)) return bannedAccountResponse();
    const limited = await consumeRateLimit(runtime.limits[scope], session.user.id);
    if (limited.status) return rateLimitResponse(limited);
    return { ...runtime, user: session.user };
  } catch (error) {
    console.error("Student API unavailable", serviceDiagnostic(error));
    return apiJson({ error: "Service unavailable" }, 503);
  }
}
