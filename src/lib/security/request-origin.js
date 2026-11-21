export function trustedRequestOrigin(request, environment = process.env) {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return false;
  if (environment.NODE_ENV === "development" && origin === "http://localhost:4173") return true;
  try {
    return origin === new URL(environment.BETTER_AUTH_URL).origin;
  } catch {
    return false;
  }
}
