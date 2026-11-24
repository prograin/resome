import { APIError } from "better-auth/api";
import { eq } from "drizzle-orm";
import { users } from "../db/schema/auth.js";
import { accountBannedCode, isStudentBanned } from "../student-account.js";

export function accountSessionPolicy(db) {
  return {
    create: {
      async before(session) {
        const [user] = await db
          .select({ academyBanned: users.academyBanned })
          .from(users)
          .where(eq(users.id, session.userId));
        if (isStudentBanned(user))
          throw new APIError("FORBIDDEN", {
            code: accountBannedCode,
            message: "This account is banned. Contact academy support.",
          });
      },
    },
  };
}
