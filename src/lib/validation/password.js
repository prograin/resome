import { z } from "zod";
import { studentAuthPolicy } from "../student-auth/config.js";

const password = z.string().min(studentAuthPolicy.password.min).max(studentAuthPolicy.password.max);
export const passwordChangeInput = z
  .strictObject({
    currentPassword: password,
    newPassword: password,
    confirmPassword: password,
    revokeOtherSessions: z.literal(true),
  })
  .refine((data) => data.newPassword === data.confirmPassword, { path: ["confirmPassword"] });
