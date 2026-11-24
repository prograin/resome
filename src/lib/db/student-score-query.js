import { and, avg, count, eq, inArray, lte, max, sql } from "drizzle-orm";
import { awards, courses, users, courseDefinitions } from "./schema/index.js";
import { rankedStudent } from "./ranking-filters.js";
import { courseDifficulty } from "./course-difficulty.js";
import { rankingPolicy } from "../scoring/policy.js";
import { scoreTime } from "./score-time.js";
export function studentScoreQuery(db, admin, now) {
  const eligiblePoints = sql`case when ${inArray(courseDifficulty(), rankingPolicy.overallLevels)} then ${awards.points} end`;
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
        overallAverage: avg(eligiblePoints).as("overall_average"),
        qualifyingAssessments: count(eligiblePoints).as("qualifying_assessments"),
        assessments: count(awards.id).as("assessments"),
        courseCount: sql`coalesce(${courseCounts.courseCount}, 0)`
          .mapWith(Number)
          .as("course_count"),
        courseId: courseCounts.courseId,
      })
      .from(users)
      .leftJoin(awards, and(eq(awards.studentId, users.id), lte(awards.recordedAt, scoreTime(now))))
      .leftJoin(courses, and(eq(courses.id, awards.courseId), eq(courses.studentId, users.id)))
      .leftJoin(courseDefinitions, eq(courseDefinitions.id, courses.definitionId))
      .leftJoin(courseCounts, eq(courseCounts.studentId, users.id))
      .where(rankedStudent(admin))
      .groupBy(users.id, courseCounts.courseCount, courseCounts.courseId),
  );
  const scores = db.$with("student_scores").as(
    db
      .select({
        studentId: raw.studentId,
        assessments: raw.assessments,
        courseCount: raw.courseCount,
        courseId: raw.courseId,
        rawAverage: raw.rawAverage,
        average: sql`${raw.rawAverage}`.mapWith(String).as("adjusted_average"),
        overallAverage: raw.overallAverage,
        inactivityPenalty: sql`0::numeric`.mapWith(String).as("inactivity_penalty"),
        inactiveMonths: sql`0::integer`.mapWith(Number).as("inactive_months"),
        overallEligible: sql`${raw.qualifyingAssessments} > 0`
          .mapWith(Boolean)
          .as("overall_eligible"),
      })
      .from(raw),
  );
  const ranks = db.$with("student_ranks").as(
    db
      .select({
        studentId: scores.studentId,
        rank: sql`row_number() over (order by ${scores.overallAverage} desc, ${scores.studentId} asc)`
          .mapWith(Number)
          .as("overall_rank"),
      })
      .from(scores)
      .where(eq(scores.overallEligible, true)),
  );
  return { courseCounts, raw, scores, ranks };
}
