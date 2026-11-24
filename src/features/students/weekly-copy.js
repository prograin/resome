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
    overallLeaders: "کل",
    courseLeaders: "دورهٔ فعلی",
    medals: ["مدال طلا", "مدال نقره", "مدال برنز"],
    username: "شاگرد",
    rank: "رتبه",
    average: "میانگین",
    change: "تغییر رتبه",
    empty: "هنوز شاگرد واجد شرایطی در رتبه‌بندی نیست",
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
    overallLeaders: "Overall",
    courseLeaders: "Current course",
    medals: ["Gold medal", "Silver medal", "Bronze medal"],
    username: "Username",
    rank: "Rank",
    average: "Average score",
    change: "Weekly change",
    empty: "No eligible students in the ranking yet",
  },
};

export function weeklyChange(value, previous, kind, locale, compact = false) {
  const copy = weeklyCopy[locale];
  const current = Number(value),
    baseline = Number(previous);
  if (value == null || previous == null || !Number.isFinite(current) || !Number.isFinite(baseline))
    return { text: "—", tone: "neutral", label: copy.noPrevious };
  const numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const difference = current - baseline;
  if (!difference)
    return {
      text: compact ? numbers.format(0) : copy.unchanged,
      tone: "neutral",
      label: copy.unchanged,
    };
  const positive = kind === "rank" ? difference < 0 : difference > 0;
  const amount =
    kind === "average" && baseline !== 0
      ? new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 }).format(
          Math.abs(difference / baseline),
        )
      : numbers.format(Math.abs(difference));
  const suffix =
    kind === "rank"
      ? positive
        ? copy.up
        : copy.down
      : kind === "count"
        ? positive
          ? copy.countMore
          : copy.countLess
        : positive
          ? copy.increase
          : copy.decrease;
  return {
    text: compact ? amount : `${amount} ${suffix}`,
    tone: positive ? "positive" : "negative",
    label: `${amount} ${suffix}`,
  };
}
