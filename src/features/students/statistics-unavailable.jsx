export function StatisticsUnavailable({ locale }) {
  return (
    <p className="student-progress__card" role="status">
      {locale === "fa"
        ? "نمایش آمار برای حساب شما غیرفعال است."
        : "Statistics are disabled for your account."}
    </p>
  );
}
