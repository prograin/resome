import { mkdtemp, mkdir, copyFile, readFile, writeFile, unlink, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pgTable, text } from "drizzle-orm/pg-core";

export const legacyUsers = pgTable("student_user", {
  id: text(),
  name: text(),
  email: text(),
  username: text(),
  github: text(),
});

export const migrateBeforeCourseDefinitions = (db) => migrateBefore(db, 5);

export async function migrateBefore(db, before) {
  const source = new URL("../../drizzle/", import.meta.url);
  const journal = JSON.parse(await readFile(new URL("meta/_journal.json", source), "utf8"));
  journal.entries = journal.entries.filter((entry) => entry.idx < before);
  const folder = await mkdtemp(path.join(tmpdir(), "prograin-migration-test-"));
  const meta = path.join(folder, "meta");
  await mkdir(meta);
  const files = journal.entries.map((entry) => `${entry.tag}.sql`);
  try {
    for (const file of files) await copyFile(new URL(file, source), path.join(folder, file));
    await writeFile(path.join(meta, "_journal.json"), JSON.stringify(journal));
    await migrate(db, { migrationsFolder: folder });
  } finally {
    for (const file of files) await unlink(path.join(folder, file)).catch(() => {});
    await unlink(path.join(meta, "_journal.json")).catch(() => {});
    await rmdir(meta);
    await rmdir(folder);
  }
}
