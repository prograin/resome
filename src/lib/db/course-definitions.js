import { asc } from "drizzle-orm";
import { courseDefinitions } from "./schema/index.js";

export function listCourseDefinitions(db) {
  return db
    .select()
    .from(courseDefinitions)
    .orderBy(asc(courseDefinitions.title), asc(courseDefinitions.id));
}
