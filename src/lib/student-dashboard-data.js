import { readStudentGoals } from "./student-goals";
import { readWeeklyStats } from "./student-weekly";
import { getStudentRuntime } from "./student-auth/server";
import {
  adminUsername,
  readStudentCourses,
  readStudentHistory,
  readStudentProgress,
} from "./student-progress";

export async function readDashboardProgress(studentId, view, statisticsVisible) {
  if (!studentId) return null;
  const readers = {
    overview: statisticsVisible ? readStudentProgress : readStudentCourses,
    chart: statisticsVisible ? readStudentProgress : null,
    history: statisticsVisible ? readStudentHistory : null,
    courses: readStudentCourses,
    goals: readStudentGoals,
  };
  const read = readers[view];
  if (!read) return null;
  const progress = await read(studentId);
  if (statisticsVisible && (view === "chart" || view === "overview")) {
    progress.courses = (await readStudentCourses(studentId)).courses;
    progress.weekly = await readWeeklyStats(getStudentRuntime().db, studentId, adminUsername());
  }
  if (view === "overview") progress.goals = (await readStudentGoals(studentId)).goals;
  if (!statisticsVisible && progress.courses) {
    progress.courses = progress.courses.map(({ average, total, rank, ...course }) => course);
  }
  return progress;
}
