export function formatGithubProfile(value = "") {
  if (!value) return "";
  const username = value.replace(/^https:\/\/github\.com\//i, "").replace(/\/$/, "");
  return `https://github.com/${username.toLowerCase()}`;
}
