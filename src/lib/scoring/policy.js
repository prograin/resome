export const legacyRankingPolicy = "weighted-total-v1";
export const rankingPolicy = Object.freeze({
  version: "average-inactivity-v2",
  minimumCourses: 2,
  inactivityDays: 30,
  firstMonthlyPenalty: 0.1,
  monthlyGrowth: 2,
  maximumAverage: 5,
  precision: 6,
});
export const maximumInactiveMonths = Math.ceil(
  Math.log1p(rankingPolicy.maximumAverage / rankingPolicy.firstMonthlyPenalty) /
    Math.log(rankingPolicy.monthlyGrowth),
);
