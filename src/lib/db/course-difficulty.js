import { sql } from "drizzle-orm";
import { courses, courseDefinitions } from "./schema/index.js";

export const courseDifficulty = () =>
  sql`case when ${courseDefinitions.sharedContent} then ${courseDefinitions.difficulty} else ${courses.difficulty} end`;
