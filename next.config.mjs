import { securityHeaders } from "./src/lib/security/headers.js";

/** @type {import("next").NextConfig} */
const config = {
  trailingSlash: true,
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  devIndicators: false,
  agentRules: false,
  poweredByHeader: false,
  serverExternalPackages: ["rate-limiter-flexible"],
  experimental: { serverActions: { bodySizeLimit: "64kb" } },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders(process.env.NODE_ENV === "development") },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default config;
