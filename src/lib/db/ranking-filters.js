import { and, eq, sql } from "drizzle-orm";
import { users } from "./schema/index.js";
export const eligibleStudent = (admin) => sql`${users.username} is distinct from ${admin}`;
export const rankedStudent = (admin) => and(eligibleStudent(admin), eq(users.academyActive, true));
