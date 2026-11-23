import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { awards, courses, goals, users } from "./schema/index.js";
import { eligibleStudent, studentRankings } from "./rankings.js";
import { studentDirectoryInput } from "../validation/admin.js";

const pageSize = 20;

export async function readAcademyAdmin(db, admin, input = {}) {
  const { q, page: requestedPage, sort, direction } = studentDirectoryInput.parse(input);
  const pattern = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
  const filter = and(
    eligibleStudent(admin),
    q
      ? or(ilike(users.name, pattern), ilike(users.username, pattern), ilike(users.email, pattern))
      : undefined,
  );
  const countOwned = (table) =>
    db
      .select({ value: count() })
      .from(table)
      .innerJoin(users, eq(users.id, table.studentId))
      .where(eligibleStudent(admin));
  const [all, matches, courseCount, assessmentCount, goalCount] = await Promise.all([
    db.select({ value: count() }).from(users).where(eligibleStudent(admin)),
    db.select({ value: count() }).from(users).where(filter),
    countOwned(courses),
    countOwned(awards),
    countOwned(goals),
  ]);
  const total = matches[0].value;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, pages);
  const ranked = studentRankings(db, admin).as("directory_scores");
  const studentCourses = db.$count(courses, eq(courses.studentId, users.id));
  const fields = {
    created: users.createdAt,
    name: users.name,
    username: users.username,
    courseCount: studentCourses,
    average: ranked.average,
    rank: ranked.overallRank,
  };
  const order = direction === "asc" ? asc(fields[sort]) : desc(fields[sort]);
  const students = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      email: users.email,
      academyActive: users.academyActive,
      courseCount: studentCourses,
      average: ranked.average,
      rank: ranked.overallRank,
    })
    .from(users)
    .leftJoin(ranked, eq(ranked.studentId, users.id))
    .where(filter)
    .orderBy(sql`${order} nulls last`, users.id)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  return {
    students,
    q,
    page,
    pages,
    total,
    sort,
    direction,
    summary: {
      students: all[0].value,
      courses: courseCount[0].value,
      assessments: assessmentCount[0].value,
      goals: goalCount[0].value,
    },
  };
}
