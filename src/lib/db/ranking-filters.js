import { and, eq, sql } from "drizzle-orm";
import { users } from "./schema/index.js";
export const eligibleStudent = (admin) => sql`${users.username} is distinct from ${admin}`;
export const usableStudent = (admin) => and(eligibleStudent(admin), eq(users.academyBanned, false));
export const rankedStudent = (admin) => and(usableStudent(admin), eq(users.academyActive, true));
