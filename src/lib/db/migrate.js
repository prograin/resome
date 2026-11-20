import { fileURLToPath } from "node:url";
import { eq, sql } from "drizzle-orm";
import { bigint, pgSchema, serial, text } from "drizzle-orm/pg-core";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { readMigrationFiles } from "drizzle-orm/migrator";
import { validateLegacySchema } from "./legacy-schema.js";

const migrationsFolder = fileURLToPath(new URL("../../../drizzle", import.meta.url));
const columns = pgSchema("information_schema").table("columns", {
  schema: text("table_schema"),
  table: text("table_name"),
  column: text("column_name"),
  type: text("data_type"),
  udt: text("udt_name"),
  nullable: text("is_nullable"),
});

// Adopt only a complete legacy schema; never recreate or drop existing student tables.
export async function migrateStudentDatabase(db, { migrationsSchema = "drizzle" } = {}) {
  const {
    rows: [{ namespace }],
  } = await db.execute(sql`select current_schema() as namespace`);
  const existing = await db.select().from(columns).where(eq(columns.schema, namespace));
  const present = new Set(existing.map((row) => `${row.table}.${row.column}`));
  const journal = pgSchema(migrationsSchema).table("__drizzle_migrations", {
    id: serial().primaryKey(),
    hash: text().notNull(),
    createdAt: bigint("created_at", { mode: "number" }),
  });
  // This is migration infrastructure DDL; application queries use the ORM builder.
  await db.execute(sql`create schema if not exists ${sql.identifier(migrationsSchema)}`);
  await db.execute(
    sql`create table if not exists ${journal} (id serial primary key, hash text not null, created_at bigint)`,
  );
  if (present.has("student_user.id") && !(await db.select().from(journal).limit(1)).length) {
    await validateLegacySchema(existing, migrationsFolder);
    const [baseline] = readMigrationFiles({ migrationsFolder });
    await db.insert(journal).values({ hash: baseline.hash, createdAt: baseline.folderMillis });
  }
  await migrate(db, { migrationsFolder, migrationsSchema });
}
