import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parseForm, parseOperation } from "../src/lib/validation/forms.js";
import { courseInput, videoInput } from "../src/lib/validation/courses.js";
import { goalInput } from "../src/lib/validation/goals.js";
import { progressInputs } from "../src/lib/validation/progress.js";
import { profileInput, emailInput } from "../src/lib/validation/profile.js";
import { signInInput } from "../src/lib/validation/sign-in.js";
import { validateLegacySchema } from "../src/lib/db/legacy-schema.js";
import { formatGithubProfile } from "../src/lib/github-profile.js";

function form(values) {
  const result = new FormData();
  for (const [key, value] of Object.entries(values)) result.set(key, value);
  return result;
}

const course = parseForm(
  courseInput,
  form({
    title: "  Course  ",
    syllabus: "First\n\n Second ",
    github: " https://github.com/python/cpython ",
  }),
);
assert.deepEqual(course, {
  title: "Course",
  difficulty: null,
  github: "https://github.com/python/cpython",
  playlist: null,
  syllabus: ["First", "Second"],
});
for (const github of [
  "http://example.com",
  "javascript:alert(1)",
  "https://user:password@example.com",
]) {
  assert.equal(parseForm(courseInput, form({ title: "Course", github })), null);
}
assert.equal(parseForm(courseInput, form({ title: "Course", syllabus: "x\n".repeat(41) })), null);
assert.equal(parseForm(courseInput, form({ title: new Blob(["not text"]) })), null);
assert.equal(
  parseForm(videoInput, form({ title: "Video", description: " ", url: "https://example.com" })),
  null,
);

const award = { course: "", points: "4", kind: "other", note: "  Follow-up  " };
assert.deepEqual(parseOperation(progressInputs, "award", form(award)), {
  courseId: null,
  points: 4,
  kind: "other",
  note: "Follow-up",
});
for (const points of ["", "0", "6", "1.5", new Blob(["file"])]) {
  assert.equal(parseOperation(progressInputs, "award", form({ ...award, points })), null);
}
assert.equal(
  parseOperation(progressInputs, "award", form({ ...award, course: "2147483648" })),
  null,
);
assert.equal(parseOperation(progressInputs, "constructor", form(award)), null);
assert.equal(parseOperation(progressInputs, "unknown", form(award)), null);
assert.deepEqual(
  parseOperation(progressInputs, "status", form({ course: "2", status: "completed" })),
  { courseId: 2, status: "completed" },
);

const goal = form({ title: "  Learn  ", priority: "2", description: " Notes ", percent: "75" });
assert.deepEqual(signInInput.parse({ username: " Student_01 ", password: " password " }), {
  username: "student_01",
  password: " password ",
});
assert.equal(
  signInInput.safeParse({ username: "student", password: new Blob(["file"]) }).success,
  false,
);
assert.equal(parseForm(goalInput, goal).percent, 75);
assert.equal(parseForm(goalInput, goal, { percent: "0" }).percent, 0);
assert.equal(parseForm(goalInput, goal, { percent: "101" }), null);
assert.equal(parseForm(goalInput, goal, { percent: null }), null);
assert.equal(parseForm(goalInput, goal, { priority: "4" }), null);

const migrationsFolder = fileURLToPath(new URL("../drizzle/", import.meta.url));
assert.equal(formatGithubProfile("Octocat"), "https://github.com/octocat");
assert.equal(formatGithubProfile(""), "");
assert.deepEqual(
  parseForm(
    profileInput,
    form({ username: "  Student_01 ", github: " https://github.com/Octocat/ " }),
  ),
  {
    firstName: "",
    lastName: "",
    username: "student_01",
    github: "https://github.com/octocat",
    telegram: "",
    linkedin: "",
    website: "",
  },
);
for (const github of [
  "octocat",
  "@octocat",
  "http://github.com/octocat",
  "https://github.com.evil.test/octocat",
  "https://github.com/octocat/project",
  "https://github.com/-octocat",
  "https://github.com/a--b",
  "https://github.com/a-",
  "https://github.com/" + "a".repeat(40),
  "https://user:password@github.com/octocat",
  "https://github.com/octocat?x=1",
  "https://github.com/octocat#test",
  "javascript:alert(1)",
]) {
  assert.equal(parseForm(profileInput, form({ username: "student", github })), null);
}
for (const username of [
  "ab",
  "a b",
  "a".repeat(31),
  "کاربر",
  "user۱۲۳",
  "usér",
  "user@name",
  new Blob(["file"]),
]) {
  assert.equal(parseForm(profileInput, form({ username })), null);
}
assert.deepEqual(parseForm(emailInput, form({ email: " Student@EXAMPLE.test " })), {
  email: "student@example.test",
});
assert.equal(parseForm(emailInput, form({ email: "invalid" })), null);
const baseline = JSON.parse(
  await readFile(new URL("../drizzle/meta/0000_snapshot.json", import.meta.url), "utf8"),
);
const existing = Object.values(baseline.tables).flatMap((table) =>
  Object.values(table.columns).map((column) => ({
    table: table.name,
    column: column.name,
    type: column.type === "text[]" ? "ARRAY" : column.type,
    udt: column.type === "text[]" ? "_text" : column.type,
    nullable: column.notNull ? "NO" : "YES",
  })),
);
await validateLegacySchema(existing, migrationsFolder);
await assert.rejects(
  validateLegacySchema(existing.slice(1), migrationsFolder),
  /incomplete or incompatible/,
);
await assert.rejects(
  validateLegacySchema(
    [{ ...existing[0], type: "integer" }, ...existing.slice(1)],
    migrationsFolder,
  ),
  /incomplete or incompatible/,
);
console.log(
  "PASS Zod form validation, file/tampered input rejection and legacy baseline compatibility.",
);
