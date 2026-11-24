export const normalizeSearchText = (value) =>
  value.normalize("NFKC").replace(/[يى]/g, "ی").replace(/ك/g, "ک").toLowerCase().trim();

export function matchesSearchText(value, query) {
  const text = normalizeSearchText(value);
  return normalizeSearchText(query)
    .split(/\s+/)
    .every((word) => text.includes(word));
}
