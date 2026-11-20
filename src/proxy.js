import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { securityHeaders } from "./lib/security/headers";

export function proxy(request) {
  const nonce = randomBytes(16).toString("base64");
  const policy = securityHeaders(process.env.NODE_ENV === "development", nonce).find(
    (header) => header.key === "Content-Security-Policy",
  ).value;
  const headers = new Headers(request.headers);
  headers.set("Content-Security-Policy", policy);
  headers.set("x-nonce", nonce);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = { matcher: ["/academy/students/:path*"] };
