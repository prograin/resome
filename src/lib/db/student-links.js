import { and, asc, gt, isNotNull } from "drizzle-orm";
import { users } from "./schema/auth.js";
import { eligibleStudent } from "./ranking-filters.js";
import { profileLinkFields } from "../profile-links.js";
import { profileLinksInput } from "../validation/profile-links.js";
import { formatGithubProfile } from "../github-profile.js";

export const studentLinksPageSize = 8;

export async function readStudentLinks(db, admin, { after, limit } = {}) {
  const query = db
    .select({
      username: users.username,
      ...Object.fromEntries(profileLinkFields.map(({ name }) => [name, users[name]])),
    })
    .from(users)
    .where(
      and(
        eligibleStudent(admin),
        isNotNull(users.username),
        after ? gt(users.username, after) : undefined,
      ),
    )
    .orderBy(asc(users.username));
  const rows = await (limit ? query.limit(limit) : query);
  return rows.map((row) => ({
    username: row.username,
    ...Object.fromEntries(
      profileLinkFields.map(({ name }) => {
        const value = name === "github" ? formatGithubProfile(row[name]) : row[name];
        const parsed = profileLinksInput.shape[name].safeParse(value);
        return [name, parsed.success ? parsed.data : ""];
      }),
    ),
  }));
}

export async function readStudentLinksPage(db, admin, after = null) {
  const rows = await readStudentLinks(db, admin, { after, limit: studentLinksPageSize + 1 });
  const students = rows.slice(0, studentLinksPageSize);
  return {
    students,
    nextCursor: rows.length > studentLinksPageSize ? students.at(-1).username : null,
  };
}
