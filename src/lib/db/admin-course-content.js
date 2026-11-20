import { and, asc, eq, inArray } from "drizzle-orm";
import { courseDefinitions, definitionVideos } from "./schema/index.js";

export async function attachDefinitionVideos(db, definitions) {
  if (!definitions.length) return definitions;
  const resources = await db
    .select()
    .from(definitionVideos)
    .where(
      inArray(
        definitionVideos.definitionId,
        definitions.map((d) => d.id),
      ),
    )
    .orderBy(asc(definitionVideos.id));
  const grouped = Map.groupBy(resources, (v) => v.definitionId);
  return definitions.map((d) => ({ ...d, videos: grouped.get(d.id) ?? [] }));
}

export async function saveDefinitionContent(db, definitionId, values) {
  if (definitionId === null) {
    await db.insert(courseDefinitions).values({ ...values, sharedContent: true });
    return true;
  }
  const updated = await db
    .update(courseDefinitions)
    .set({ ...values, sharedContent: true })
    .where(eq(courseDefinitions.id, definitionId))
    .returning({ id: courseDefinitions.id });
  return updated.length === 1;
}

export function saveDefinitionVideo(db, definitionId, videoId, values) {
  return db.transaction(async (tx) => {
    const [definition] = await tx
      .select({ id: courseDefinitions.id })
      .from(courseDefinitions)
      .where(eq(courseDefinitions.id, definitionId))
      .for("no key update");
    if (!definition) return false;
    const saved =
      videoId === null
        ? await tx
            .insert(definitionVideos)
            .values({ definitionId, ...values })
            .onConflictDoNothing()
            .returning({ id: definitionVideos.id })
        : await tx
            .update(definitionVideos)
            .set(values)
            .where(
              and(
                eq(definitionVideos.id, videoId),
                eq(definitionVideos.definitionId, definitionId),
              ),
            )
            .returning({ id: definitionVideos.id });
    if (saved.length)
      await tx
        .update(courseDefinitions)
        .set({ sharedContent: true })
        .where(eq(courseDefinitions.id, definitionId));
    return saved.length === 1;
  });
}
