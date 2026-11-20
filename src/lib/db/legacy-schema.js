import { readFile } from "node:fs/promises";
import path from "node:path";

export async function validateLegacySchema(existing, migrationsFolder) {
  const baseline = JSON.parse(
    await readFile(path.join(migrationsFolder, "meta/0000_snapshot.json"), "utf8"),
  );
  const actual = new Map(existing.map((column) => [`${column.table}.${column.column}`, column]));
  const incompatible = [];
  for (const table of Object.values(baseline.tables)) {
    for (const column of Object.values(table.columns)) {
      const key = `${table.name}.${column.name}`;
      const found = actual.get(key);
      const matches =
        column.type === "text[]"
          ? found?.type === "ARRAY" && found.udt === "_text"
          : found?.type === column.type;
      if (!matches || (column.notNull && found.nullable !== "NO")) incompatible.push(key);
    }
  }
  if (incompatible.length)
    throw new Error(
      `Legacy student schema is incomplete or incompatible: ${incompatible.join(", ")}`,
    );
}
