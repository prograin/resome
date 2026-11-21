import { studentPaths } from "../../lib/student-auth/paths";

export function studentNavigation(copy, selected, locale) {
  const query = selected ? `?student=${encodeURIComponent(selected.id)}` : "";
  return [
    [studentPaths.dashboard + query, "layout", copy.overview, "overview"],
    [
      studentPaths.courses + query,
      "graduation-cap",
      selected ? (locale === "fa" ? "دوره‌های شاگرد" : "Student courses") : copy.courses,
      "courses",
    ],
    [studentPaths.goals + query, "tag", copy.goals, "goals"],
    [studentPaths.chart + query, "sparkles", copy.chart, "chart"],
    [studentPaths.history + query, "clock", copy.history, "history"],
    ...(!selected ? [[studentPaths.links, "link", copy.links, "links"]] : []),
  ];
}
