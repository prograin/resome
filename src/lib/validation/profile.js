import { z } from "zod";
import { usernameInput } from "./sign-in.js";
import { visibleStudentEmail } from "../student-auth/student-email.js";
import { profileLinksInput } from "./profile-links.js";

export const profileInput = z.object({
  ...profileLinksInput.shape,
  firstName: z.string().trim().max(80).default(""),
  lastName: z.string().trim().max(80).default(""),
  username: usernameInput,
});

export const emailInput = z.object({
  email: z
    .string()
    .trim()
    .max(254)
    .toLowerCase()
    .pipe(z.email())
    .refine((value) => Boolean(visibleStudentEmail(value))),
});

export const emailVerificationInput = emailInput.extend({
  otp: z
    .string()
    .trim()
    .transform((value) => value.replace(/[۰-۹٠-٩]/g, (digit) => String(digit.charCodeAt(0) % 16)))
    .pipe(z.string().regex(/^\d{4}$/)),
});
