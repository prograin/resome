import { z } from "zod";

const authEnvironment = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url().refine((value) => {
    const url = new URL(value);
    return (
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.pathname === "/" &&
      (url.protocol === "https:" ||
        (url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)))
    );
  }),
});

export class AuthConfigurationError extends Error {
  constructor(fields) {
    super(`Invalid student authentication configuration: ${fields.join(", ")}`);
    this.name = "AuthConfigurationError";
    this.code = "AUTH_CONFIG_INVALID";
    this.fields = fields;
  }
}

export function readAuthEnvironment(environment = process.env) {
  const result = authEnvironment.safeParse(environment);
  if (!result.success) {
    const fields = [...new Set(result.error.issues.map((issue) => issue.path.join(".")))];
    throw new AuthConfigurationError(fields);
  }
  return result.data;
}
