import { AuthConfigurationError } from "./environment.js";

export function serviceDiagnostic(error) {
  if (error instanceof AuthConfigurationError) return { code: error.code, fields: error.fields };
  const code = error?.cause?.code ?? error?.code;
  return {
    code: typeof code === "string" && /^[A-Z0-9_]{1,64}$/.test(code) ? code : "SERVICE_FAILED",
    type:
      error instanceof TypeError
        ? "TypeError"
        : error instanceof RangeError
          ? "RangeError"
          : "Error",
  };
}
