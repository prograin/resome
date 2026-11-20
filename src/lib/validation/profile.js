import { z } from "zod";
import { usernameInput } from "./sign-in.js";
import { visibleStudentEmail } from "../student-auth/student-email.js";

export const profileInput = z.object({
  firstName: z.string().trim().max(80).default(""),
  lastName: z.string().trim().max(80).default(""),
  github: z
    .string()
    .trim()
    .max(39)
    .regex(/^(?:[a-z0-9]+(?:-[a-z0-9]+)*)?$/i)
    .toLowerCase()
    .default(""),
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
