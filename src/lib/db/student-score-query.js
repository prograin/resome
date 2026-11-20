import { and, avg, count, eq, lte, max, sql } from "drizzle-orm";
import { awards, courses, users } from "./schema/index.js";
import { eligibleStudent } from "./ranking-filters.js";
import { inactivityScore } from "./inactivity-score.js";
import { rankingPolicy } from "../scoring/policy.js";
import { scoreTime } from "./score-time.js";
export function studentScoreQuery(db, admin, now) {
  const courseCounts = db.$with("course_counts").as(
    db
      .select({
        studentId: courses.studentId,
        courseCount: count().as("course_count"),
        courseId: max(courses.id).as("latest_course_id"),
      })
      .from(courses)
      .groupBy(courses.studentId),
  );
  const raw = db.$with("student_raw_scores").as(
    db
      .select({
        studentId: users.id,
        rawAverage: avg(awards.points).as("raw_average"),
        assessments: count(awards.id).as("assessments"),
        lastAssessment: max(awards.recordedAt).as("last_assessment"),
        courseCount: sql`coalesce(${courseCounts.courseCount}, 0)`
          .mapWith(Number)
          .as("course_count"),
        courseId: courseCounts.courseId,
      })
      .from(users)
      .leftJoin(awards, and(eq(awards.studentId, users.id), lte(awards.recordedAt, scoreTime(now))))
      .leftJoin(courseCounts, eq(courseCounts.studentId, users.id))
      .where(eligibleStudent(admin))
      .groupBy(users.id, courseCounts.courseCount, courseCounts.courseId),
  );
  const scores = db.$with("student_scores").as(
    db
      .select({
        studentId: raw.studentId,
        assessments: raw.assessments,
        courseCount: raw.courseCount,
        courseId: raw.courseId,
        ...inactivityScore(raw.rawAverage, raw.lastAssessment, now),
        overallEligible:
          sql`${raw.courseCount} >= ${rankingPolicy.minimumCourses} and ${raw.assessments} > 0`
            .mapWith(Boolean)
            .as("overall_eligible"),
      })
      .from(raw),
  );
  const ranks = db.$with("student_ranks").as(
    db
      .select({
        studentId: scores.studentId,
        rank: sql`rank() over (order by ${scores.average} desc)`.mapWith(Number).as("overall_rank"),
      })
      .from(scores)
      .where(eq(scores.overallEligible, true)),
  );
  return { courseCounts, raw, scores, ranks };
}
