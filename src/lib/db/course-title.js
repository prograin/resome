import { sql } from "drizzle-orm";
import { courses, courseDefinitions } from "./schema/index.js";

export const courseTitle = () =>
  sql`case when ${courseDefinitions.sharedContent} then ${courseDefinitions.title} else ${courses.title} end`;
