import path from "node:path";

const sharedAcademy = new Set(["tokens.css", "mobile-header.css", "student-sidebar.css"]);

export function includeStyle(group, file) {
  if (!file.startsWith("src/css/pages/academy/")) return true;
  if (group !== "academy" && group !== "students") return false;
  const name = path.posix.basename(file);
  if (sharedAcademy.has(name)) return true;
  const studentStyle =
    /^(student-|admin[.-]|goal-slider\.|tables\.|table-sorting\.|depth\.|surfaces\.|controls\.)/.test(
      name,
    );
  return group === "students" ? studentStyle : !studentStyle;
}
