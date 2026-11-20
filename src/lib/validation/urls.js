import { z } from "zod";

export const secureUrl = z
  .string()
  .trim()
  .max(2048)
  .pipe(z.url({ protocol: /^https$/ }))
  .refine((value) => {
    const url = new URL(value);
    return !url.username && !url.password;
  })
  .transform((value) => new URL(value).href)
  .pipe(z.string().max(2048));
