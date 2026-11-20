import { useEffect, useRef } from "react";
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { usePreferences } from "../../components/preferences";
import { chartAxisTitle } from "./chart-axis-title";

Chart.register(CategoryScale, LinearScale, LineController, LineElement, PointElement, Tooltip);

function positionAxisTitles(chart) {
  const mobile = window.matchMedia("(width < 48rem)").matches;
  chart.options.scales.x.title.display = !mobile;
  chart.options.scales.y.title.display = !mobile;
  chart.options.scales.xTitle.display = mobile;
  chart.options.scales.yTitle.display = mobile;
}

export function PointsChart({ history, copy, locale, mode = "entry" }) {
  const canvas = useRef(null);
  const { theme } = usePreferences();

  useEffect(() => {
    let chart;
    const frame = requestAnimationFrame(() => {
      const element = canvas.current;
      const mobile = window.matchMedia("(width < 48rem)").matches;
      const style = getComputedStyle(element);
      const text = style.getPropertyValue("--ui-text").trim();
      const line = style.getPropertyValue("--ui-line").trim();
      const accent = style.getPropertyValue("--ui-accent").trim();
      const numbers = new Intl.NumberFormat(locale);
      const entries = [...history].sort(
        (a, b) => new Date(a.recordedAt) - new Date(b.recordedAt) || a.id - b.id,
      );
      let total = 0;
      const data = entries.map(({ points }) =>
        mode === "cumulative" ? (total += points) : points,
      );
      const dates = new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
        timeZone: "Asia/Tehran",
      });
      const tooltipDates = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "Asia/Tehran",
      });
      const colors = entries.map(({ points }) =>
        style.getPropertyValue(`--academy-score-${points}`).trim(),
      );
      chart = new Chart(element, {
        type: "line",
        data: {
          labels: entries.map((entry, index) =>
            mode === "date" ? dates.format(new Date(entry.recordedAt)) : numbers.format(index + 1),
          ),
          datasets: [
            {
              label: copy.points,
              data,
              borderColor: accent,
              pointBackgroundColor: colors,
              pointBorderColor: colors,
              pointRadius:
                mode === "cumulative"
                  ? ({ dataIndex, chart }) => {
                      const last = entries.length - 1;
                      const visiblePoints = Math.max(3, Math.floor(chart.width / 56));
                      const interval = Math.max(1, Math.ceil(last / (visiblePoints - 1)));
                      return dataIndex === last || dataIndex % interval === 0 ? 4 : 0;
                    }
                  : 4,
              pointHoverRadius: 6,
              clip: false,
              borderWidth: 2,
            },
          ],
        },
        options: {
          locale,
          responsive: true,
          onResize: positionAxisTitles,
          maintainAspectRatio: false,
          animation: false,
          font: { family: style.fontFamily },
          color: text,
          interaction: { mode: "nearest", axis: "x", intersect: false },
          plugins: {
            tooltip: {
              displayColors: false,
              rtl: locale === "fa",
              textDirection: locale === "fa" ? "rtl" : "ltr",
              titleColor: accent,
              titleFont: { family: style.fontFamily },
              bodyFont: { family: style.fontFamily },
              callbacks: {
                title: ([item]) =>
                  tooltipDates.format(new Date(entries[item.dataIndex].recordedAt)),
                afterLabel: ({ dataIndex }) => {
                  const note = entries[dataIndex].note?.trim();
                  return note ? (note.match(/.{1,40}(?:\s|$)|.{1,40}/gu) ?? []) : [];
                },
              },
            },
          },
          scales: {
            x: {
              position: "bottom",
              title: {
                display: !mobile,
                text: mode === "date" ? copy.date : copy.entryNumber,
                color: text,
              },
              ticks: {
                maxRotation: 0,
                maxTicksLimit: mode === "cumulative" ? 8 : undefined,
                color: text,
                font: { family: style.fontFamily, size: 13 },
              },
              grid: { display: false },
              border: { color: line },
            },
            y: {
              position: "left",
              suggestedMin: mode === "cumulative" ? 0 : 1,
              max: mode === "cumulative" ? undefined : 5,
              title: { display: !mobile, text: copy.points, color: text },
              ticks: {
                stepSize: mode === "cumulative" ? undefined : 1,
                maxTicksLimit: mode === "cumulative" ? 7 : undefined,
                precision: 0,
                color: text,
                font: { family: style.fontFamily, size: 13 },
              },
              grid: { color: line },
              border: { color: line },
            },
            xTitle: chartAxisTitle(
              "x",
              mode === "date" ? copy.date : copy.entryNumber,
              text,
              style.fontFamily,
              mobile,
            ),
            yTitle: chartAxisTitle("y", copy.points, text, style.fontFamily, mobile),
          },
        },
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      chart?.destroy();
    };
  }, [copy, history, locale, theme, mode]);

  return (
    <div className="student-progress__plot academy-inset" dir="ltr">
      <canvas ref={canvas} role="img" aria-label={copy.chart} />
    </div>
  );
}
