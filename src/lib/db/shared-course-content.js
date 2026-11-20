import { asc, eq, inArray } from "drizzle-orm";
import { courseDefinitions, definitionVideos } from "./schema/index.js";

export async function attachSharedCourseContent(db, assignments) {
  if (!assignments.length) return assignments;
  const ids = [...new Set(assignments.map((row) => row.definitionId))];
  const definitions = await db
    .select()
    .from(courseDefinitions)
    .where(inArray(courseDefinitions.id, ids));
  const shared = definitions.filter((definition) => definition.sharedContent);
  if (!shared.length) return assignments;
  const resources = await db
    .select()
    .from(definitionVideos)
    .where(
      inArray(
        definitionVideos.definitionId,
        shared.map((d) => d.id),
      ),
    )
    .orderBy(asc(definitionVideos.id));
  const grouped = Map.groupBy(resources, (video) => video.definitionId);
  const byId = new Map(shared.map((definition) => [definition.id, definition]));
  return assignments.map((assignment) => {
    const definition = byId.get(assignment.definitionId);
    if (!definition) return assignment;
    const { title, difficulty, github, playlist, syllabus } = definition;
    return {
      ...assignment,
      title,
      difficulty,
      github,
      playlist,
      syllabus,
      sharedContent: true,
      videos: grouped.get(definition.id) ?? [],
    };
  });
}

export async function writeSharedCourseContent(tx, definitionId, operation, values) {
  const [definition] = await tx
    .select()
    .from(courseDefinitions)
    .where(eq(courseDefinitions.id, definitionId))
    .for("no key update");
  if (!definition?.sharedContent) return null;
  if (operation === "course") {
    await tx.update(courseDefinitions).set(values).where(eq(courseDefinitions.id, definitionId));
    return true;
  }
  const created = await tx
    .insert(definitionVideos)
    .values({ definitionId, ...values })
    .onConflictDoNothing()
    .returning({ id: definitionVideos.id });
  return created.length === 1;
}
