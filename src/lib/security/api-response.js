export function apiJson(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store", ...headers },
  });
}

export function rateLimitResponse(result) {
  if (!result.status) return null;
  return apiJson(
    { error: result.status === "limit" ? "Try again later" : "Service unavailable" },
    result.status === "limit" ? 429 : 503,
    { "Retry-After": String(result.retryAfter ?? 5) },
  );
}
