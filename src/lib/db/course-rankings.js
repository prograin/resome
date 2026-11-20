import { and, avg, count, eq, gt, lte, sql } from "drizzle-orm";
import { awards, courses, users } from "./schema/index.js";
import { eligibleStudent } from "./ranking-filters.js";
import { scoreTime } from "./score-time.js";
export function courseRankings(db, admin, now) {
  const totals = db.$with("course_totals").as(
    db
      .select({
        studentId: courses.studentId,
        courseId: courses.id,
        definitionId: courses.definitionId,
        average: avg(awards.points).as("course_average"),
      })
      .from(courses)
      .innerJoin(users, eq(users.id, courses.studentId))
      .leftJoin(
        awards,
        and(
          eq(awards.courseId, courses.id),
          eq(awards.studentId, courses.studentId),
          lte(awards.recordedAt, scoreTime(now)),
        ),
      )
      .where(eligibleStudent(admin))
      .groupBy(courses.id)
      .having(gt(count(awards.id), 0)),
  );
  const ranks = db.$with("course_ranks").as(
    db
      .select({
        studentId: totals.studentId,
        courseId: totals.courseId,
        rank: sql`rank() over (partition by ${totals.definitionId} order by ${totals.average} desc)`
          .mapWith(Number)
          .as("course_rank"),
      })
      .from(totals),
  );
  return { totals, ranks };
}
