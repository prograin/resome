import {
  users,
  courses,
  courseDefinitions,
  awards,
  weeklyRuns,
  weeklyStats,
} from "../../src/lib/db/schema/index.js";
import { previousStudentWeek, startOfStudentWeek } from "../../src/lib/db/weekly-calendar.js";
import { rankingPolicy } from "../../src/lib/scoring/policy.js";

export async function seedWeeklyChanges(db, fixture) {
  const ids = [fixture.studentId, fixture.otherId, "trend_down", "trend_missing"];
  await db
    .insert(users)
    .values(
      ids.slice(2).map((id) => ({ id, username: id, name: id, email: `${id}@example.test` })),
    );
  const definitions = await db
    .insert(courseDefinitions)
    .values([{ title: "Foundation" }, { title: "Current course" }])
    .returning();
  const current = [];
  for (const [index, studentId] of ids.entries()) {
    const assigned = await db
      .insert(courses)
      .values(
        definitions.map((definition) => ({
          studentId,
          definitionId: definition.id,
          title: definition.title,
        })),
      )
      .returning();
    current.push(assigned[1]);
    await db.insert(awards).values({
      studentId,
      courseId: assigned[1].id,
      points: [4, 5, 3, 2][index],
      kind: "session",
    });
  }
  const week = previousStudentWeek(startOfStudentWeek());
  await db.insert(weeklyRuns).values({ week, policyVersion: rankingPolicy.version });
  await db.insert(weeklyStats).values(
    ids.slice(0, 3).map((studentId, index) => ({
      studentId,
      week,
      policyVersion: rankingPolicy.version,
      average: String([3, 4, 5][index]),
      assessments: 0,
      overallRank: [2, 3, 1][index],
      courseRank: 1,
      courseId: current[index].id,
    })),
  );
}
