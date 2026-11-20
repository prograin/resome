import { createDatabase } from "../../src/lib/db/client.js";
import { courseDefinitions, definitionVideos, goals } from "../../src/lib/db/schema/index.js";

export async function seedManagedCourse() {
  const { db, pool } = createDatabase(process.env.STUDENT_TEST_DATABASE_URL);
  try {
    const [definition] = await db
      .insert(courseDefinitions)
      .values({
        title: "Fixture Course",
        sharedContent: true,
        difficulty: "advanced",
        github: "https://github.com/python/cpython",
        syllabus: ["Functions", "Databases"],
      })
      .returning();
    await db.insert(definitionVideos).values({
      definitionId: definition.id,
      title: "Fixture video",
      description: "Fixture video description",
      url: "https://video.cs50.io/JP7ITIXGpHk",
    });
    return definition.id;
  } finally {
    await pool.end();
  }
}

export async function seedManagementGoals(studentId) {
  const { db, pool } = createDatabase(process.env.STUDENT_TEST_DATABASE_URL);
  try {
    await db.insert(goals).values(
      Array.from({ length: 5 }, (_, index) => ({
        studentId,
        title: `Management goal ${index + 1}`,
        priority: 2,
        studentPercent: index * 10,
      })),
    );
  } finally {
    await pool.end();
  }
}
