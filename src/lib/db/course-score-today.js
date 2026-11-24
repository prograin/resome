import { and, eq, exists, gte, lte, sql } from "drizzle-orm";
import { awards, courses } from "./schema/index.js";
import { scoreTime } from "./score-time.js";

export function hasCourseScoreToday(db, now) {
  const time = scoreTime(now);
  const start = sql`date_trunc('day', ${time} at time zone 'Asia/Tehran') at time zone 'Asia/Tehran'`;
  return exists(
    db
      .select({ id: awards.id })
      .from(awards)
      .where(
        and(
          eq(awards.courseId, courses.id),
          eq(awards.studentId, courses.studentId),
          gte(awards.recordedAt, start),
          lte(awards.recordedAt, time),
        ),
      ),
  );
}
