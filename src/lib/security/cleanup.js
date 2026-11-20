import { lt } from "drizzle-orm";
import { mutationLimits } from "../db/schema/security.js";
import { sessions, verifications } from "../db/schema/auth.js";

export function clearExpiredSecurityRecords(db) {
  const now = new Date();
  return Promise.all([
    db
      .delete(mutationLimits)
      .where(lt(mutationLimits.expire, new Date(now.getTime() - 86_400_000))),
    db.delete(sessions).where(lt(sessions.expiresAt, now)),
    db.delete(verifications).where(lt(verifications.expiresAt, now)),
  ]);
}
