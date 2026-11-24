import assert from "node:assert/strict";
import { readCourses } from "../../src/lib/db/student-courses.js";
import { users, courses, courseDefinitions, awards } from "../../src/lib/db/schema/index.js";
import { readCurrentCourseLeaders } from "../../src/lib/db/course-leaders.js";

export async function checkCourseLeaders(db) {
  const ids = ["course_top_a", "course_top_b", "course_inactive", "course_banned"];
  await db.insert(users).values(
    ids.map((id, index) => ({
      id,
      username: id,
      name: id,
      email: `${id}@example.test`,
      academyActive: index < 2,
      academyBanned: index === 3,
    })),
  );
  const [definition, empty] = await db
    .insert(courseDefinitions)
    .values([{ title: "Leaderboard course" }, { title: "No scores yet" }])
    .returning();
  const enrollments = await db
    .insert(courses)
    .values(
      ids.map((studentId) => ({ studentId, definitionId: definition.id, title: definition.title })),
    )
    .returning();
  await db.insert(awards).values(
    enrollments.map((course, index) => ({
      studentId: course.studentId,
      courseId: course.id,
      points: index === 0 ? 3 : 5,
      kind: "other",
    })),
  );
  const leaders = await readCurrentCourseLeaders(db, ids[0], "teacher");
  assert.deepEqual(
    leaders.map((row) => row.username),
    [ids[1], ids[0]],
  );
  assert.deepEqual(
    leaders.map((row) => row.overallRank),
    [1, 2],
  );
  assert.deepEqual(
    leaders.map((row) => Number(row.average)),
    [5, 3],
  );
  assert.ok(leaders.every((row) => row.previousRank === null));
  const [repeated] = await db
    .insert(courses)
    .values({
      studentId: ids[1],
      definitionId: definition.id,
      title: definition.title,
    })
    .returning();
  assert.deepEqual(
    (await readCurrentCourseLeaders(db, ids[0], "teacher")).map((row) => row.username),
    [ids[0]],
    "a new unscored enrollment must not fall back to an old score",
  );
  await db
    .insert(awards)
    .values({ studentId: ids[1], courseId: repeated.id, points: 4, kind: "other" });
  const unique = await readCurrentCourseLeaders(db, ids[0], "teacher");
  assert.deepEqual(
    unique.map((row) => row.username),
    [ids[1], ids[0]],
  );
  assert.deepEqual(
    unique.map((row) => row.overallRank),
    [1, 2],
  );
  assert.deepEqual(
    unique.map((row) => Number(row.average)),
    [4, 3],
  );
  const own = (await readCourses(db, ids[1], "teacher")).courses;
  assert.equal(own.find((row) => row.id === repeated.id).rank, 1);
  assert.equal(own.find((row) => row.id === enrollments[1].id).rank, null);
  assert.equal(
    Number(own.find((row) => row.id === enrollments[1].id).average),
    5,
    "old scores are preserved",
  );
  assert.deepEqual(await readCurrentCourseLeaders(db, "missing", "teacher"), []);
  await db
    .insert(courses)
    .values({ studentId: ids[0], definitionId: empty.id, title: empty.title });
  assert.deepEqual(await readCurrentCourseLeaders(db, ids[0], "teacher"), []);
  console.log(
    "PASS current-course leaderboard: course isolation, first-course inclusion, averages, inactive/banned exclusion and empty states.",
  );
}
