import { and, asc, eq, getTableColumns, notExists, sql } from "drizzle-orm";
import { courseDefinitions, courses, users } from "./schema/index.js";
import { eligibleStudent, courseRankings } from "./rankings.js";
import { attachDefinitionVideos } from "./admin-course-content.js";
import { addStudentAward, addStudentCourse } from "./student-records.js";

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
      status: courses.status,
      average: totals.average,
      rank: ranks.rank,
    })
    .from(courses)
    .innerJoin(users, and(eq(users.id, courses.studentId), eligibleStudent(admin)))
    .leftJoin(totals, eq(totals.courseId, courses.id))
    .leftJoin(ranks, eq(ranks.courseId, courses.id))
    .where(
      and(
        eq(courses.definitionId, definitionId),
        gradesOnly ? eq(courses.status, "active") : undefined,
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
  return db.transaction(async (tx) => {
    const [definition] = await tx
      .select()
      .from(courseDefinitions)
      .where(eq(courseDefinitions.id, definitionId))
      .for("no key update");
    if (!definition) return "invalid";
    if (operation === "enroll") {
      const [student] = await tx
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.id, values.studentId), eligibleStudent(admin)))
        .for("update");
      if (!student) return "invalid";
      const assignment = await addStudentCourse(tx, {
        studentId: student.id,
        definitionId,
        title: definition.title,
      });
      return assignment ? "saved" : "duplicateEnrollment";
    }
    const [assignment] = await tx
      .select({ id: courses.id, studentId: courses.studentId, status: courses.status })
      .from(courses)
      .innerJoin(users, and(eq(users.id, courses.studentId), eligibleStudent(admin)))
      .where(and(eq(courses.id, assignmentId), eq(courses.definitionId, definitionId)))
      .for("update", { of: courses });
    if (!assignment) return "invalid";
    if (operation === "status") {
      await tx.update(courses).set({ status: values.status }).where(eq(courses.id, assignment.id));
      return "saved";
    }
    if (operation !== "grade" || assignment.status !== "active") return "inactiveEnrollment";
    await addStudentAward(
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
    return "saved";
  });
}
