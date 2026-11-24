import { and, asc, eq, getTableColumns, notExists, sql } from "drizzle-orm";
import { courseDefinitions, courses, users } from "./schema/index.js";
import { eligibleStudent, courseRankings } from "./rankings.js";
import { attachDefinitionVideos } from "./admin-course-content.js";
import { addStudentAward } from "./student-records.js";
import { enrollCourseStudents } from "./course-enrollments.js";
import { rankedStudent } from "./ranking-filters.js";
import { hasCourseScoreToday } from "./course-score-today.js";

export async function readAdminCourses(db, admin) {
  const definitions = await db
    .select({
      ...getTableColumns(courseDefinitions),
      active:
        sql`count(${courses.id}) filter (where ${users.id} is not null and ${courses.status} = 'active')`.mapWith(
          Number,
        ),
      completed:
        sql`count(${courses.id}) filter (where ${users.id} is not null and ${courses.status} = 'completed')`.mapWith(
          Number,
        ),
    })
    .from(courseDefinitions)
    .leftJoin(courses, eq(courses.definitionId, courseDefinitions.id))
    .leftJoin(users, and(eq(users.id, courses.studentId), eligibleStudent(admin)))
    .groupBy(courseDefinitions.id)
    .orderBy(asc(courseDefinitions.title), courseDefinitions.id);
  return attachDefinitionVideos(db, definitions);
}

export async function readAdminCourse(db, admin, definitionId, gradesOnly = false) {
  const [definition] = await db
    .select()
    .from(courseDefinitions)
    .where(eq(courseDefinitions.id, definitionId));
  if (!definition) return null;
  const { totals, ranks } = courseRankings(db, admin);
  const enrollments = await db
    .with(totals, ranks)
    .select({
      id: courses.id,
      studentId: users.id,
      name: users.name,
      firstName: users.firstName,
      lastName: users.lastName,
      username: users.username,
      academyActive: users.academyActive,
      academyBanned: users.academyBanned,
      status: courses.status,
      average: totals.average,
      rank: ranks.rank,
      scoredToday: hasCourseScoreToday(db),
    })
    .from(courses)
    .innerJoin(users, and(eq(users.id, courses.studentId), eligibleStudent(admin)))
    .leftJoin(totals, eq(totals.courseId, courses.id))
    .leftJoin(ranks, eq(ranks.courseId, courses.id))
    .where(
      and(
        eq(courses.definitionId, definitionId),
        gradesOnly ? and(eq(courses.status, "active"), rankedStudent(admin)) : undefined,
      ),
    )
    .orderBy(courses.status, asc(users.name), courses.id);
  const candidates = gradesOnly
    ? []
    : await db
        .select({ id: users.id, name: users.name, username: users.username })
        .from(users)
        .where(
          and(
            eligibleStudent(admin),
            notExists(
              db
                .select({ id: courses.id })
                .from(courses)
                .where(
                  and(eq(courses.studentId, users.id), eq(courses.definitionId, definitionId)),
                ),
            ),
          ),
        )
        .orderBy(asc(users.name), users.id);
  return { definition, enrollments, candidates };
}

export function writeAdminCourse(db, admin, definitionId, operation, assignmentId, values) {
  if (operation === "enroll" || operation === "enrollMany")
    return enrollCourseStudents(
      db,
      admin,
      definitionId,
      operation === "enroll" ? [values.studentId] : values.studentIds,
    );
  return db.transaction(async (tx) => {
    const [definition] = await tx
      .select()
      .from(courseDefinitions)
      .where(eq(courseDefinitions.id, definitionId))
      .for("no key update");
    if (!definition) return "invalid";
    const [assignment] = await tx
      .select({ id: courses.id, studentId: courses.studentId, status: courses.status })
      .from(courses)
      .innerJoin(users, and(eq(users.id, courses.studentId), eligibleStudent(admin)))
      .where(and(eq(courses.id, assignmentId), eq(courses.definitionId, definitionId)));
    if (!assignment) return "invalid";
    await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, assignment.studentId))
      .for("update");
    const [current] = await tx
      .select({ status: courses.status })
      .from(courses)
      .where(eq(courses.id, assignment.id))
      .for("update");
    if (!current) return "invalid";
    if (operation === "status") {
      await tx.update(courses).set({ status: values.status }).where(eq(courses.id, assignment.id));
      return "saved";
    }
    if (operation !== "grade" || current.status !== "active") return "inactiveEnrollment";
    const award = await addStudentAward(
      tx,
      {
        studentId: assignment.studentId,
        courseId: assignment.id,
        points: values.points,
        note: values.note,
        kind: values.kind,
      },
      definition.title,
    );
    return award ? "saved" : "scoringDisabled";
  });
}
