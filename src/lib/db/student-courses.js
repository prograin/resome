import { and, asc, avg, desc, eq, getTableColumns, inArray, lte, sql } from "drizzle-orm";
import { courses, videos, awards } from "./schema/index.js";
import { courseRankings } from "./rankings.js";
import { attachSharedCourseContent, writeSharedCourseContent } from "./shared-course-content.js";
import { scoreTime } from "./score-time.js";

async function readScoredCourses(db, studentId, admin, now) {
  const { totals, ranks } = courseRankings(db, admin, now);
  return db
    .with(totals, ranks)
    .select({
      ...getTableColumns(courses),
      rank: ranks.rank,
      average: avg(awards.points),
      total: sql`coalesce(sum(${awards.points}), 0)`.mapWith(String),
    })
    .from(courses)
    .leftJoin(
      awards,
      and(
        eq(awards.courseId, courses.id),
        eq(awards.studentId, studentId),
        lte(awards.recordedAt, scoreTime(now)),
      ),
    )
    .leftJoin(ranks, and(eq(ranks.studentId, courses.studentId), eq(ranks.courseId, courses.id)))
    .where(eq(courses.studentId, studentId))
    .groupBy(courses.id, ranks.rank)
    .orderBy(desc(courses.id));
}

export async function readCourses(db, studentId, admin, now, { statisticsEnabled = true } = {}) {
  const rows = statisticsEnabled
    ? await readScoredCourses(db, studentId, admin, now)
    : await db
        .select()
        .from(courses)
        .where(eq(courses.studentId, studentId))
        .orderBy(desc(courses.id));
  if (!rows.length) return { courses: [] };
  const resources = await db
    .select()
    .from(videos)
    .where(
      inArray(
        videos.courseId,
        rows.map((row) => row.id),
      ),
    )
    .orderBy(asc(videos.id));
  const grouped = Map.groupBy(resources, (video) => video.courseId);
  return {
    courses: await attachSharedCourseContent(
      db,
      rows.map((row) => ({ ...row, videos: grouped.get(row.id) ?? [] })),
    ),
  };
}

export async function updateCourseContent(db, studentId, courseId, operation, values) {
  const ownCourse = and(eq(courses.studentId, studentId), eq(courses.id, courseId));
  return db.transaction(async (tx) => {
    const [course] = await tx
      .select({ id: courses.id, definitionId: courses.definitionId })
      .from(courses)
      .where(ownCourse);
    if (!course) return false;
    const shared = await writeSharedCourseContent(tx, course.definitionId, operation, values);
    if (shared !== null) return shared;
    if (operation === "course") {
      return (
        (await tx.update(courses).set(values).where(ownCourse).returning({ id: courses.id }))
          .length === 1
      );
    }
    return (
      (
        await tx
          .insert(videos)
          .values({ courseId, ...values })
          .onConflictDoNothing()
          .returning({ id: videos.id })
      ).length === 1
    );
  });
}
