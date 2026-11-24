"use client";

import { useId, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { Button } from "./button";
import { usePreferences } from "../preferences";
import { normalizeSearchText as normalize } from "../../lib/search-text";

export function MultiSelect({
  name,
  label,
  options,
  value,
  onValueChange,
  copy,
  disabled,
  maxSelected = 100,
}) {
  const { dir, locale } = usePreferences();
  const id = useId();
  const search = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = new Set(value);
  const words = normalize(query).split(/\s+/);
  const visible = options.filter((option) => {
    const text = normalize(`${option.label} ${option.description ?? ""}`);
    return words.every((word) => text.includes(word));
  });
  const summary = value.length
    ? `${new Intl.NumberFormat(locale).format(value.length)} ${copy.selected}`
    : label;
  return (
    <div className="ui-multi-select">
      <label htmlFor={id}>{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(value)} />
      <Popover.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          setQuery("");
        }}
      >
        <Popover.Trigger asChild>
          <Button
            id={id}
            variant="soft"
            className="ui-select"
            disabled={disabled}
            data-multi-select-name={name}
            aria-label={`${label}: ${summary}`}
          >
            <span>{summary}</span>
            <ChevronDown size={18} aria-hidden="true" />
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="ui-multi-select__content academy-neo"
            dir={dir}
            align="start"
            sideOffset={8}
            collisionPadding={16}
            aria-label={label}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              search.current?.focus();
            }}
          >
            <input
              ref={search}
              className="ui-multi-select__search"
              type="search"
              aria-label={copy.searchStudents}
              placeholder={copy.searchStudents}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={disabled}
            />
            <div className="ui-multi-select__options" role="group" aria-label={label}>
              {visible.map((option) => (
                <button
                  type="button"
                  className="ui-multi-select__option"
                  key={option.value}
                  aria-pressed={selected.has(option.value)}
                  disabled={
                    disabled || (!selected.has(option.value) && selected.size >= maxSelected)
                  }
                  data-select-value={option.value}
                  onClick={() =>
                    onValueChange(
                      selected.has(option.value)
                        ? value.filter((item) => item !== option.value)
                        : [...value, option.value],
                    )
                  }
                >
                  <span className="ui-multi-select__identity">
                    <strong dir="auto">{option.label}</strong>
                    {option.description && (
                      <bdi
                        className="ui-multi-select__username"
                        dir="ltr"
                        title={option.description}
                      >
                        {option.description}
                      </bdi>
                    )}
                  </span>
                </button>
              ))}
              {!visible.length && <p role="status">{copy.noMatches}</p>}
            </div>
            <div className="ui-multi-select__actions">
              <small role="status">{summary}</small>
              <button
                type="button"
                className="ui-multi-select__clear"
                onClick={() => onValueChange([])}
                disabled={disabled || !value.length}
              >
                {copy.clearSelection}
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
