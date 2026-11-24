import { desc, eq } from "drizzle-orm";
import { getStudentRuntime } from "./student-auth/server.js";
import { awards, courses, courseDefinitions } from "./db/schema/index.js";
import { courseTitle } from "./db/course-title.js";
import { studentRankings } from "./db/rankings.js";
import { readCourses } from "./db/student-courses.js";
import { writeProgress } from "./db/student-writes.js";

export function adminUsername() {
  return process.env.STUDENT_ADMIN_USERNAME?.trim().toLowerCase() || null;
}

export function isStudentAdmin(user) {
  return Boolean(adminUsername() && user.username === adminUsername());
}

export function readStudentCourses(studentId, options) {
  return readCourses(getStudentRuntime().db, studentId, adminUsername(), undefined, options);
}

export async function readStudentProgress(studentId) {
  const db = getStudentRuntime().db;
  const ranked = studentRankings(db, adminUsername()).as("ranked");
  const [[score], history] = await Promise.all([
    db
      .select({
        average: ranked.average,
        rawAverage: ranked.rawAverage,
        inactivityPenalty: ranked.inactivityPenalty,
        inactiveMonths: ranked.inactiveMonths,
        assessments: ranked.assessments,
        courseCount: ranked.courseCount,
        overallEligible: ranked.overallEligible,
        rank: ranked.overallRank,
      })
      .from(ranked)
      .where(eq(ranked.studentId, studentId)),
    readStudentHistory(studentId),
  ]);
  return { score: score ?? null, ...history };
}

export async function readStudentHistory(studentId) {
  const history = await getStudentRuntime()
    .db.select({
      id: awards.id,
      points: awards.points,
      kind: awards.kind,
      note: awards.note,
      courseId: awards.courseId,
      recordedAt: awards.recordedAt,
      course: courseTitle(),
    })
    .from(awards)
    .leftJoin(courses, eq(courses.id, awards.courseId))
    .leftJoin(courseDefinitions, eq(courseDefinitions.id, courses.definitionId))
    .where(eq(awards.studentId, studentId))
    .orderBy(desc(awards.recordedAt), desc(awards.id));
  return { history };
}

export function writeStudentProgress(studentId, operation, values) {
  return writeProgress(getStudentRuntime().db, studentId, adminUsername(), operation, values);
}
