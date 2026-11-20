import { z } from "zod";
import { studentAuthPolicy as policy } from "../student-auth/config.js";

export const usernameInput = z
  .string()
  .trim()
  .min(policy.username.min)
  .max(policy.username.max)
  .regex(policy.username.pattern)
  .toLowerCase();

export const signInInput = z.strictObject({
  username: usernameInput,
  password: z.string().min(policy.password.min).max(policy.password.max),
  rememberMe: z.boolean().optional(),
});
