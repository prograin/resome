import { sql } from "drizzle-orm";
import { maximumInactiveMonths, rankingPolicy as policy } from "../scoring/policy.js";
import { scoreTime } from "./score-time.js";
export function inactivityScore(average, lastAssessment, now) {
  const seconds = policy.inactivityDays * 86400;
  const months = sql`greatest(0, floor(extract(epoch from (${scoreTime(now)} - ${lastAssessment})) / ${seconds}))`;
  const loss = sql`${policy.firstMonthlyPenalty}::numeric * (power(${policy.monthlyGrowth}::numeric, least(${months}, ${maximumInactiveMonths})) - 1)`;
  return {
    rawAverage: average,
    average:
      sql`case when ${average} is null then null else round(greatest(0, ${average} - ${loss}), ${policy.precision}) end`
        .mapWith(String)
        .as("adjusted_average"),
    inactivityPenalty: sql`case when ${average} is null then 0 else least(${average}, ${loss}) end`
      .mapWith(String)
      .as("inactivity_penalty"),
    inactiveMonths: sql`case when ${lastAssessment} is null then 0 else ${months} end`
      .mapWith(Number)
      .as("inactive_months"),
  };
}
