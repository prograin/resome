import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { getTableName, getTableColumns } from "drizzle-orm";
import * as schema from "./schema/index.js";

export const databaseSchemaVersion = JSON.stringify(
  Object.values(schema).map((table) => [
    getTableName(table),
    Object.entries(getTableColumns(table)).map(([key, column]) => [
      key,
      column.name,
      column.getSQLType(),
      column.notNull,
      column.hasDefault,
    ]),
  ]),
);

export function createDatabase(connectionString = process.env.DATABASE_URL, existingPool) {
  if (!connectionString) throw new Error("DATABASE_URL is required.");
  const pool =
    existingPool ?? new pg.Pool({ connectionString, connectionTimeoutMillis: 5000, max: 5 });
  if (!existingPool)
    pool.on("error", (error) => console.error("Database idle connection failed", error.code));
  return { pool, db: drizzle(pool, { schema }) };
}
