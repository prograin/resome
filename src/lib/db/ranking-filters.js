import { sql } from "drizzle-orm";
import { users } from "./schema/index.js";
export const eligibleStudent = (admin) => sql`${users.username} is distinct from ${admin}`;
