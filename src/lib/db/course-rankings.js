import { and, avg, count, eq, gt, lte, notExists, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { awards, courses, users } from "./schema/index.js";
import { rankedStudent } from "./ranking-filters.js";
import { scoreTime } from "./score-time.js";
export function courseRankings(db, admin, now) {
  const newer = alias(courses, "newer_course");
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
      .where(rankedStudent(admin))
      .groupBy(courses.id)
      .having(gt(count(awards.id), 0)),
  );
  const ranks = db.$with("course_ranks").as(
    db
      .select({
        studentId: totals.studentId,
        courseId: totals.courseId,
        rank: sql`row_number() over (partition by ${totals.definitionId} order by ${totals.average} desc, ${totals.studentId} asc, ${totals.courseId} asc)`
          .mapWith(Number)
          .as("course_rank"),
      })
      .from(totals)
      .where(
        notExists(
          db
            .select({ id: newer.id })
            .from(newer)
            .where(
              and(
                eq(newer.studentId, totals.studentId),
                eq(newer.definitionId, totals.definitionId),
                gt(newer.id, totals.courseId),
              ),
            ),
        ),
      ),
  );
  return { totals, ranks };
}
