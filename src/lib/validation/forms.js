import { z } from "zod";

export const databaseId = z.number().int().positive().max(2147483647);
export const studentIdInput = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[a-z0-9_-]+$/i);
export const formInteger = (min, max) =>
  z.string().trim().min(1).pipe(z.coerce.number().int().min(min).max(max));
export const formId = formInteger(1, 2147483647);
export const optionalText = (max) => z.string().trim().max(max).default("");

export function parseQuery(schema, searchParams) {
  const entries = [...searchParams.entries()];
  if (new Set(entries.map(([key]) => key)).size !== entries.length) return null;
  const result = schema.safeParse(Object.fromEntries(entries));
  return result.success ? result.data : null;
}

export function parseForm(schema, form, overrides = {}) {
  if (!schema || !(form instanceof FormData)) return null;
  const entries = [...form.entries()];
  const keys = entries.map(([key]) => key);
  if (new Set(keys).size !== keys.length) return null;
  const result = schema.safeParse({ ...Object.fromEntries(form), ...overrides });
  return result.success ? result.data : null;
}

export function parseOperation(schemas, operation, form) {
  return parseForm(
    typeof operation === "string" && Object.hasOwn(schemas, operation) ? schemas[operation] : null,
    form,
  );
}
