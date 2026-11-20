import { and, desc, eq } from "drizzle-orm";
import { getStudentRuntime } from "./student-auth/server.js";
import { goals } from "./db/schema/index.js";

export async function readStudentGoals(studentId) {
  return {
    goals: await getStudentRuntime()
      .db.select({
        id: goals.id,
        title: goals.title,
        description: goals.description,
        priority: goals.priority,
        studentPercent: goals.studentPercent,
      })
      .from(goals)
      .where(eq(goals.studentId, studentId))
      .orderBy(goals.priority, desc(goals.id)),
  };
}

export async function saveStudentGoal(studentId, id, { title, description, priority, percent }) {
  const db = getStudentRuntime().db;
  const values = { title, description, priority, studentPercent: percent };
  const query =
    id === null
      ? db.insert(goals).values({ studentId, ...values })
      : db
          .update(goals)
          .set(values)
          .where(and(eq(goals.studentId, studentId), eq(goals.id, id)));
  return (await query.returning({ id: goals.id })).length === 1;
}
