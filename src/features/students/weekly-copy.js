export const weeklyChangeClass = {
  positive: "student-weekly-change--positive",
  negative: "student-weekly-change--negative",
  neutral: "student-weekly-change--neutral",
};

export const weeklyCopy = {
  fa: {
    noPrevious: "هنوز دادهٔ هفتهٔ قبل موجود نیست",
    unchanged: "بدون تغییر نسبت به هفتهٔ قبل",
    up: "پله صعود نسبت به هفتهٔ قبل",
    down: "پله نزول نسبت به هفتهٔ قبل",
    increase: "افزایش نسبت به هفتهٔ قبل",
    decrease: "کاهش نسبت به هفتهٔ قبل",
    countMore: "ارزیابی بیشتر نسبت به هفتهٔ قبل",
    countLess: "ارزیابی کمتر نسبت به هفتهٔ قبل",
    updated: "تاریخ به‌روزرسانی",
    pending: "آمار زنده؛ اولین ثبت هفتگی هنوز انجام نشده است",
    leaders: "۱۰ نفر برتر",
    medals: ["مدال طلا", "مدال نقره", "مدال برنز"],
    username: "شاگرد",
    rank: "رتبه",
    average: "میانگین",
    change: "تغییر رتبه",
    empty: "هنوز شاگرد واجد شرایطی در رتبه‌بندی نیست",
    unchangedShort: "بدون تغییر",
    upShort: "پله صعود",
    downShort: "پله نزول",
  },
  en: {
    noPrevious: "No previous-week data yet",
    unchanged: "No change from last week",
    up: "places up from last week",
    down: "places down from last week",
    increase: "increase from last week",
    decrease: "decrease from last week",
    countMore: "more assessments than last week",
    countLess: "fewer assessments than last week",
    updated: "Update date",
    pending: "Live statistics; the first weekly snapshot is pending",
    leaders: "Top 10 students",
    medals: ["Gold medal", "Silver medal", "Bronze medal"],
    username: "Username",
    rank: "Rank",
    average: "Average score",
    change: "Weekly change",
    empty: "No eligible students in the ranking yet",
    unchangedShort: "Unchanged",
    upShort: "places up",
    downShort: "places down",
  },
};

export function weeklyChange(value, previous, kind, locale, compact = false) {
  const copy = weeklyCopy[locale];
  if (value == null || previous == null)
    return { text: "—", tone: "neutral", label: copy.noPrevious };
  const difference = Number(value) - Number(previous);
  if (!difference) return { text: compact ? copy.unchangedShort : copy.unchanged, tone: "neutral" };
  const positive = kind === "rank" ? difference < 0 : difference > 0;
  const numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const amount =
    kind === "average" && Number(previous) !== 0
      ? new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 }).format(
          Math.abs(difference / Number(previous)),
        )
      : numbers.format(Math.abs(difference));
  const suffix =
    kind === "rank"
      ? positive
        ? compact
          ? copy.upShort
          : copy.up
        : compact
          ? copy.downShort
          : copy.down
      : kind === "count"
        ? positive
          ? copy.countMore
          : copy.countLess
        : positive
          ? copy.increase
          : copy.decrease;
  return {
    text: `${amount} ${suffix}`,
    tone: positive ? "positive" : "negative",
  };
}
