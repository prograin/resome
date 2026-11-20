import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import { users, courseDefinitions, courses, videos, awards } from "../src/lib/db/schema/index.js";
import { saveDefinitionContent, saveDefinitionVideo } from "../src/lib/db/admin-course-content.js";
import { readCourses, updateCourseContent } from "../src/lib/db/student-courses.js";
import { readAdminCourses, writeAdminCourse } from "../src/lib/db/admin-courses.js";
import { courseInput, videoInput } from "../src/lib/validation/courses.js";
import { studentRankings } from "../src/lib/db/rankings.js";

const { db, close } = await createTestDatabase("course_resources");
try {
  await migrateStudentDatabase(db);
  await db
    .insert(users)
    .values(
      ["a", "b", "c"].map((id) => ({ id, name: id, username: id, email: `${id}@example.test` })),
    );
  const values = courseInput.parse({
    title: "Shared course",
    difficulty: "intermediate",
    github: "https://github.com/prograin/course",
    playlist: "https://www.youtube.com/playlist?list=example",
    syllabus: "Basics\nAPIs",
  });
  assert.equal(await saveDefinitionContent(db, null, values), true);
  const [definition] = await db.select().from(courseDefinitions);
  const enroll = (id) =>
    writeAdminCourse(db, null, definition.id, "enroll", null, { studentId: id });
  await enroll("a");
  await enroll("b");
  const read = async (id) => (await readCourses(db, id, null)).courses[0];
  const a = await read("a");
  assert.equal(a.github, values.github);
  assert.equal(a.playlist, values.playlist);
  assert.deepEqual(a.syllabus, ["Basics", "APIs"]);
  assert.equal(a.difficulty, "intermediate");
  const video = videoInput.parse({
    title: "Video 1",
    description: "Example lesson",
    url: "https://example.test/lesson",
  });
  assert.equal(await saveDefinitionVideo(db, definition.id, null, video), true);
  assert.equal(await saveDefinitionVideo(db, definition.id, null, video), false);
  assert.equal((await read("a")).videos[0].title, video.title);
  assert.equal((await read("b")).videos.length, 1);
  await enroll("c");
  assert.equal((await read("c")).videos.length, 1);
  const [other] = await db.insert(courseDefinitions).values({ title: "Other" }).returning();
  const resource = (await read("a")).videos[0];
  assert.equal(
    await saveDefinitionVideo(db, other.id, resource.id, { ...video, title: "Wrong owner" }),
    false,
  );
  assert.equal(
    await saveDefinitionVideo(db, definition.id, resource.id, {
      ...video,
      title: "Updated lesson",
    }),
    true,
  );
  assert.equal((await read("b")).videos[0].title, "Updated lesson");
  await db.update(courses).set({ status: "completed" }).where(eq(courses.id, a.id));
  await db.insert(awards).values({ studentId: "a", courseId: a.id, points: 4, kind: "other" });
  await saveDefinitionContent(db, definition.id, {
    ...values,
    title: "Renamed shared course",
    github: "https://github.com/prograin/new",
  });
  assert.equal((await read("a")).status, "completed");
  assert.equal((await read("a")).title, "Renamed shared course");
  assert.equal((await read("b")).github, "https://github.com/prograin/new");
  assert.equal(
    (await studentRankings(db, null)).find((r) => r.studentId === "a").courseTitle,
    "Renamed shared course",
  );
  assert.equal(Number((await read("a")).average), 4);
  assert.equal(
    await updateCourseContent(db, "a", a.id, "course", { ...values, title: "Shared edit" }),
    true,
  );
  assert.equal((await read("b")).title, "Shared edit");
  assert.equal(await updateCourseContent(db, "b", a.id, "course", values), false);
  assert.equal(
    await updateCourseContent(db, "a", a.id, "video", {
      ...video,
      url: "https://example.test/another",
    }),
    true,
  );
  assert.equal((await read("c")).videos.length, 2);
  const [legacy] = await db
    .insert(courses)
    .values({
      studentId: "a",
      definitionId: other.id,
      title: "Custom legacy",
      github: "https://example.test/custom",
    })
    .returning();
  await db.insert(videos).values({ courseId: legacy.id, ...video });
  const preserved = (await readCourses(db, "a", null)).courses.find((c) => c.id === legacy.id);
  assert.equal(preserved.title, "Custom legacy");
  assert.equal(preserved.github, "https://example.test/custom");
  assert.equal(preserved.videos.length, 1);
  assert.equal(
    (await readAdminCourses(db, null)).find((d) => d.id === definition.id).videos.length,
    2,
  );
  assert.equal(
    courseInput.safeParse({ ...values, syllabus: "Basics", github: "javascript:alert(1)" }).success,
    false,
  );
  console.log(
    "PASS shared course metadata, videos, existing/future/completed enrollments, edits, isolation, preserved scores and legacy resources.",
  );
} finally {
  await close();
}
