import { and, eq } from "drizzle-orm";
import { contact, origin } from "../../src/config/site.js";
import { users } from "../../src/lib/db/schema/auth.js";
import { internalStudentEmail } from "../../src/lib/student-auth/student-email.js";
import { profileLinksInput } from "../../src/lib/validation/profile-links.js";

const examples = [
  {
    github: "https://github.com/prograin",
    telegram: `https://t.me/${contact.telegram}`,
    linkedin: contact.linkedin,
    website: origin,
  },
  { github: "https://github.com/octocat", website: "https://example.com/" },
  { telegram: `https://t.me/${contact.telegram}` },
  { github: "https://github.com/prograin", linkedin: contact.linkedin },
  { website: "https://example.org/" },
  {
    github: "https://github.com/octocat",
    telegram: `https://t.me/${contact.telegram}`,
    website: "https://example.net/",
  },
];

export async function seedDemoLinks(db) {
  return db.transaction(async (tx) => {
    let updatedProfiles = 0;
    for (const [index, example] of examples.entries()) {
      const username = `demo_${String(index + 1).padStart(2, "0")}`;
      if (username === process.env.STUDENT_ADMIN_USERNAME?.trim().toLowerCase())
        throw new Error("Cannot add demo links to an administrator account.");
      const [student] = await tx
        .select()
        .from(users)
        .where(
          and(
            eq(users.username, username),
            eq(users.email, internalStudentEmail(`academy-demo-${username}`)),
          ),
        )
        .for("update");
      if (!student) continue;
      const values = profileLinksInput.parse(example);
      const patch = Object.fromEntries(
        Object.entries(values).filter(([name, value]) => value && !student[name]),
      );
      if (!Object.keys(patch).length) continue;
      await tx
        .update(users)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(users.id, student.id));
      updatedProfiles++;
    }
    return updatedProfiles;
  });
}
