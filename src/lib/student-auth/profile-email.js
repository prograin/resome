import { eq } from "drizzle-orm";
import { users } from "../db/schema/auth.js";
import { consumeMutationLimit } from "../security/mutation-limit.js";
import { visibleStudentEmail } from "./student-email.js";
import { confirmEmailDelivery } from "../email/delivery-status.js";

const errors = {
  INVALID_OTP: "invalidCode",
  OTP_EXPIRED: "expiredCode",
  TOO_MANY_ATTEMPTS: "codeAttempts",
  SESSION_IS_NOT_FRESH: "freshSession",
  SESSION_EXPIRED: "freshSession",
  23514: "emailLocked",
  23505: "emailUnavailable",
};

export async function changeProfileEmail(runtime, userId, headers, operation, values) {
  const { db, auth, limits } = runtime;
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user || visibleStudentEmail(user.email) || user.emailVerified) return "emailLocked";
  const scopes = operation === "send" ? ["emailCooldown", "emailSend"] : ["emailVerify"];
  for (const scope of scopes) {
    const limited = await consumeMutationLimit(limits, userId, scope);
    if (limited) return limited === "limit" && operation === "send" ? "emailLimit" : limited;
  }
  try {
    if (operation === "send") {
      const [existing] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, values.email));
      if (existing) return "emailUnavailable";
      const delivered = await confirmEmailDelivery(() =>
        auth.api.requestEmailChangeEmailOTP({ headers, body: { newEmail: values.email } }),
      );
      return delivered ? "sent" : "emailFailed";
    }
    await auth.api.changeEmailEmailOTP({
      headers,
      body: { newEmail: values.email, otp: values.otp },
    });
    return "saved";
  } catch (error) {
    const code = error.body?.code ?? error.cause?.code ?? error.code;
    if (errors[code]) return errors[code];
    console.error("Email verification failed", code ?? "EMAIL_VERIFICATION_FAILED");
    return "emailFailed";
  }
}
