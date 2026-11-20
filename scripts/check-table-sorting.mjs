import assert from "node:assert/strict";
import { sortTableRows, nextTableSort } from "../src/lib/table-sorting.js";
import { createTestDatabase } from "./lib/test-database.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import { users, courses, courseDefinitions, awards } from "../src/lib/db/schema/index.js";
import { readAcademyAdmin } from "../src/lib/db/academy-admin.js";

const original = [
  { id: "a", score: 2 },
  { id: "b", score: 10 },
  { id: "c", score: null },
  { id: "d", score: 2 },
];
const columns = [{ key: "score", value: (row) => row.score }];
assert.deepEqual(
  sortTableRows(original, columns, { key: "score", direction: "asc" }, "fa").map((r) => r.id),
  ["a", "d", "b", "c"],
);
assert.deepEqual(
  sortTableRows(original, columns, { key: "score", direction: "desc" }, "fa").map((r) => r.id),
  ["b", "a", "d", "c"],
);
assert.deepEqual(
  original.map((r) => r.id),
  ["a", "b", "c", "d"],
);
assert.deepEqual(
  sortTableRows(
    ["پارسا", "آراد", "بهار"],
    [{ key: "name", value: (name) => name }],
    { key: "name", direction: "asc" },
    "fa",
  ),
  ["آراد", "بهار", "پارسا"],
);
assert.deepEqual(nextTableSort({ key: "score", direction: "asc" }, "score"), {
  key: "score",
  direction: "desc",
});
assert.deepEqual(nextTableSort({ key: "score", direction: "desc" }, "name"), {
  key: "name",
  direction: "asc",
});
const { db, close } = await createTestDatabase("table_sorting");
try {
  await migrateStudentDatabase(db);
  const students = Array.from({ length: 25 }, (_, i) => ({
    id: `sort_${String(i + 1).padStart(2, "0")}`,
    username: `sort_${String(i + 1).padStart(2, "0")}`,
    name: `Student ${String(i + 1).padStart(2, "0")}`,
    email: `sort${i}@example.test`,
  }));
  await db
    .insert(users)
    .values([
      ...students,
      { id: "teacher", username: "teacher", name: "Teacher", email: "teacher@example.test" },
    ]);
  const [definition] = await db
    .insert(courseDefinitions)
    .values({ title: "Sorting fixture" })
    .returning();
  await db.insert(courses).values(
    students.flatMap((s, i) =>
      Array.from({ length: (i % 12) + 1 }, () => ({
        studentId: s.id,
        definitionId: definition.id,
        title: definition.title,
      })),
    ),
  );
  await db
    .insert(awards)
    .values(
      students
        .slice(0, -1)
        .map((s, i) => ({ studentId: s.id, points: (i % 5) + 1, kind: "other" })),
    );
  const first = await readAcademyAdmin(db, "teacher", { sort: "name", direction: "asc" });
  const second = await readAcademyAdmin(db, "teacher", {
    sort: "name",
    direction: "asc",
    page: "2",
  });
  assert.equal(first.total, 25);
  assert.equal(first.students.length, 20);
  assert.equal(second.students.length, 5);
  assert.equal(first.students[0].name, "Student 01");
  assert.equal(second.students[0].name, "Student 21");
  assert.equal(new Set([...first.students, ...second.students].map((s) => s.id)).size, 25);
  const byCount = await readAcademyAdmin(db, "teacher", { sort: "courseCount", direction: "desc" });
  assert.equal(byCount.students[0].courseCount, 12);
  for (const direction of ["asc", "desc"]) {
    const a = await readAcademyAdmin(db, "teacher", { sort: "average", direction });
    const b = await readAcademyAdmin(db, "teacher", { sort: "average", direction, page: "2" });
    const values = [...a.students, ...b.students].map((s) =>
      s.average == null ? null : Number(s.average),
    );
    assert.equal(values.at(-1), null);
    const graded = values.slice(0, -1);
    assert.deepEqual(
      graded,
      graded.toSorted((x, y) => (direction === "asc" ? x - y : y - x)),
    );
  }
  const search = await readAcademyAdmin(db, "teacher", {
    q: "Student 2",
    sort: "name",
    direction: "desc",
  });
  assert.equal(search.students[0].name, "Student 25");
  const invalid = await readAcademyAdmin(db, "teacher", {
    sort: "name; drop table student_user",
    direction: "invalid",
  });
  assert.equal(invalid.sort, "created");
  assert.equal(invalid.direction, "desc");
  console.log(
    "PASS numeric/Persian/stable sorting, nulls last, safe server ordering, search and sorting across pagination.",
  );
} finally {
  await close();
}
