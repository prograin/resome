export function nextTableSort(current, key) {
  return { key, direction: current.key === key && current.direction === "asc" ? "desc" : "asc" };
}

export function sortTableRows(rows, columns, sorting, locale) {
  const column = columns.find((item) => item.key === sorting.key);
  if (!column?.value) return rows;
  const collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" });
  return rows.toSorted((a, b) => {
    const left = column.value(a),
      right = column.value(b);
    if (left == null) return right == null ? 0 : 1;
    if (right == null) return -1;
    const comparison =
      typeof left === "number" && typeof right === "number"
        ? left - right
        : collator.compare(String(left), String(right));
    return sorting.direction === "desc" ? -comparison : comparison;
  });
}
