import { and, eq } from "drizzle-orm";
import { courses, courseDefinitions } from "./schema/index.js";
import { courseTitle } from "./course-title.js";
import { courseRankings } from "./course-rankings.js";
import { studentScoreQuery } from "./student-score-query.js";
export { eligibleStudent } from "./ranking-filters.js";
export { courseRankings } from "./course-rankings.js";
export function studentRankings(db, admin, now) {
  const { totals, ranks: courseRanks } = courseRankings(db, admin, now);
  const { courseCounts, raw, scores, ranks } = studentScoreQuery(db, admin, now);
  return db
    .with(courseCounts, raw, scores, ranks, totals, courseRanks)
    .select({
      studentId: scores.studentId,
      average: scores.average,
      overallAverage: scores.overallAverage,
      rawAverage: scores.rawAverage,
      inactivityPenalty: scores.inactivityPenalty,
      inactiveMonths: scores.inactiveMonths,
      assessments: scores.assessments,
      courseCount: scores.courseCount,
      overallEligible: scores.overallEligible,
      overallRank: ranks.rank,
      courseId: scores.courseId,
      courseTitle: courseTitle().as("course_title"),
      courseRank: courseRanks.rank,
    })
    .from(scores)
    .leftJoin(ranks, eq(ranks.studentId, scores.studentId))
    .leftJoin(courses, eq(courses.id, scores.courseId))
    .leftJoin(courseDefinitions, eq(courseDefinitions.id, courses.definitionId))
    .leftJoin(
      courseRanks,
      and(eq(courseRanks.studentId, scores.studentId), eq(courseRanks.courseId, courses.id)),
    );
}
