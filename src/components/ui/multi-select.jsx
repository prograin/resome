"use client";

import { useId, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { Button } from "./button";
import { usePreferences } from "../preferences";

const normalize = (value) =>
  value.normalize("NFKC").replace(/[يى]/g, "ی").replace(/ك/g, "ک").toLowerCase().trim();

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
                <label
                  className="ui-multi-select__option"
                  key={option.value}
                  data-checked={selected.has(option.value)}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(option.value)}
                    disabled={
                      disabled || (!selected.has(option.value) && selected.size >= maxSelected)
                    }
                    data-select-value={option.value}
                    onChange={(event) =>
                      onValueChange(
                        event.target.checked
                          ? [...value, option.value]
                          : value.filter((item) => item !== option.value),
                      )
                    }
                  />
                  <span>
                    <strong>{option.label}</strong>
                    {option.description && <small dir="ltr">{option.description}</small>}
                  </span>
                </label>
              ))}
              {!visible.length && <p role="status">{copy.noMatches}</p>}
            </div>
            <div className="ui-multi-select__actions">
              <Button
                className="academy-neo"
                variant="soft"
                onClick={() => onValueChange([])}
                disabled={disabled || !value.length}
              >
                {copy.clearSelection}
              </Button>
              <Popover.Close asChild>
                <Button variant="soft" className="academy-neo">
                  {copy.done}
                </Button>
              </Popover.Close>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
