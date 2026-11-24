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
  const readCoursesForView = (id) =>
    readStudentCourses(id, { statisticsEnabled: statisticsVisible });
  const readers = {
    overview: statisticsVisible ? readStudentProgress : readCoursesForView,
    chart: statisticsVisible ? readStudentProgress : null,
    history: readStudentHistory,
    courses: readCoursesForView,
    goals: readStudentGoals,
  };
  const read = readers[view];
  if (!read) return null;
  const progress = await read(studentId);
  if (statisticsVisible && (view === "chart" || view === "overview")) {
    progress.courses = (await readCoursesForView(studentId)).courses;
    progress.weekly = await readWeeklyStats(getStudentRuntime().db, studentId, adminUsername());
  }
  if (view === "overview") progress.goals = (await readStudentGoals(studentId)).goals;
  return progress;
}
