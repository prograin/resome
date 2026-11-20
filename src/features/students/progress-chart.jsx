import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { ProgressMetrics } from "./progress-metrics";
import { WeeklyLeaderboard } from "./weekly-leaderboard";

const PointsChart = dynamic(() => import("./points-chart").then((module) => module.PointsChart), {
  ssr: false,
  loading: () => <div className="student-progress__plot" aria-hidden="true" />,
});

export function ProgressChart({ progress, copy, locale }) {
  const [mode, setMode] = useState("entry");
  const [range, setRange] = useState("all");
  const [now, setNow] = useState(() => Date.now());
  const { history = [] } = progress ?? {};
  const modes = [
    ["entry", copy.byEntry],
    ["date", copy.byDate],
    ["cumulative", copy.cumulative],
  ];
  const entries =
    range === "all"
      ? history
      : history.filter(({ recordedAt }) => {
          const time = new Date(recordedAt).getTime();
          return time >= now - Number(range) * 86400000 && time <= now;
        });
  return (
    <div className="student-chart-layout">
      <ProgressMetrics progress={progress ?? {}} copy={copy} locale={locale} />
      <div className="student-chart">
        <div className="student-progress__card student-chart__graph">
          <h2>{copy.chart}</h2>
          <div className="student-chart__controls">
            <div className="student-chart__modes" role="group" aria-label={copy.chart}>
              {modes.map(([key, label]) => (
                <Button
                  key={key}
                  variant={mode === key ? "primary" : "soft"}
                  aria-pressed={mode === key}
                  onClick={() => setMode(key)}
                >
                  {label}
                </Button>
              ))}
            </div>
            <label className="student-panel__form student-chart__mode-select">
              <select
                aria-label={copy.chartMode}
                value={mode}
                onChange={(event) => setMode(event.target.value)}
              >
                {modes.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="student-panel__form">
              <select
                aria-label={copy.timeRange}
                value={range}
                onChange={(event) => {
                  setNow(Date.now());
                  setRange(event.target.value);
                }}
              >
                <option value="all">{copy.allTime}</option>
                <option value="7">{copy.lastWeek}</option>
                <option value="30">{copy.lastMonth}</option>
                <option value="90">{copy.lastQuarter}</option>
              </select>
            </label>
          </div>
          {entries.length ? (
            <PointsChart history={entries} copy={copy} locale={locale} mode={mode} />
          ) : (
            <div className="student-progress__plot student-chart__empty" role="status">
              <p>{history.length ? copy.noRangeStats : copy.noStatistics}</p>
            </div>
          )}
        </div>
        <WeeklyLeaderboard weekly={progress?.weekly} locale={locale} />
      </div>
    </div>
  );
}
