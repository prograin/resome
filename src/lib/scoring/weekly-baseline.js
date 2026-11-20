import { previousStudentWeek, startOfStudentWeek } from "../db/weekly-calendar.js";
export function weeklyBaseline(stats, now = new Date()) {
  if (!stats) return null;
  const current = startOfStudentWeek(now);
  if (stats.week === previousStudentWeek(current)) return stats;
  if (stats.week !== current) return null;
  return {
    average: stats.previousAverage,
    assessments: stats.previousAssessments,
    overallRank: stats.previousRank,
    courseRank: stats.previousCourseRank,
    courseId: stats.previousCourseId,
  };
}
