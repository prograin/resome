"use client";

import { useId, useState } from "react";
import { SiteLink } from "../site-link";
import { Icon } from "../icon";
import { Button } from "./button";
import { nextTableSort, sortTableRows } from "../../lib/table-sorting";

const labels = {
  fa: { by: "مرتب‌سازی بر اساس", asc: "صعودی", desc: "نزولی" },
  en: { by: "Sort by", asc: "Ascending", desc: "Descending" },
};

export function useTableSorting(rows, columns, initial, locale) {
  const [sorting, setSorting] = useState(initial);
  return {
    rows: sortTableRows(rows, columns, sorting, locale),
    sorting,
    onSort: (key) => setSorting((current) => nextTableSort(current, key)),
  };
}

export function SortableTableHead({ column, sorting, onSort, href, locale }) {
  const active = column.key === sorting.key;
  const direction = nextTableSort(sorting, column.key).direction;
  const label = `${labels[locale].by} ${column.label}؛ ${labels[locale][direction]}`;
  const Element = href ? SiteLink : "button";
  return (
    <th
      scope="col"
      className={column.className}
      aria-label={column.label}
      aria-sort={active ? (sorting.direction === "asc" ? "ascending" : "descending") : undefined}
    >
      {column.key ? (
        <Element
          className="student-table__sort"
          {...(href ? { href } : { type: "button", onClick: () => onSort(column.key) })}
          aria-label={label}
          title={label}
        >
          <span>{column.label}</span>
          <Icon
            name={
              active ? (sorting.direction === "asc" ? "arrow-up" : "arrow-down") : "arrow-up-down"
            }
          />
        </Element>
      ) : (
        column.label
      )}
    </th>
  );
}

export function TableSortControls({ columns, sorting, onSort, locale, mobileOnly = true, label }) {
  const id = useId();
  const copy = labels[locale];
  return (
    <div
      className={`student-table__sort-tools${mobileOnly ? " student-table__sort-tools--mobile" : ""}`}
    >
      <label htmlFor={id}>{label ?? copy.by}</label>
      <select id={id} value={sorting.key} onChange={(event) => onSort(event.target.value)}>
        {columns
          .filter((column) => column.key)
          .map((column) => (
            <option key={column.key} value={column.key}>
              {column.label}
            </option>
          ))}
      </select>
      <Button
        variant="soft"
        onClick={() => onSort(sorting.key)}
        aria-label={`${copy.by} ${columns.find((c) => c.key === sorting.key)?.label}؛ ${copy[sorting.direction === "asc" ? "desc" : "asc"]}`}
      >
        <Icon name={sorting.direction === "asc" ? "arrow-up" : "arrow-down"} />
        <span>{copy[sorting.direction]}</span>
      </Button>
    </div>
  );
}
