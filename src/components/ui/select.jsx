"use client";

import * as Primitive from "@radix-ui/react-select";
import { Children, isValidElement, useState, useRef, useEffect } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { usePreferences } from "../preferences";

const emptyValue = "__prograin_empty__";
export function Select({
  children,
  name,
  value,
  defaultValue,
  onValueChange,
  required,
  disabled,
  className = "",
  ...props
}) {
  const { dir } = usePreferences();
  const options = Children.toArray(children)
    .filter(isValidElement)
    .map(({ props: option }) => ({
      ...option,
      value: String(option.value ?? option.children),
    }));
  const placeholder = options.find((option) => option.value === "" && option.disabled);
  const encode = (next) => (next === "" ? (placeholder ? undefined : emptyValue) : String(next));
  const selected = value === undefined ? undefined : encode(value);
  const initial = encode(defaultValue ?? options[0]?.value ?? "");
  const [internal, setInternal] = useState(initial);
  const current = value === undefined ? (internal ?? "") : (selected ?? "");
  const trigger = useRef(null);
  const resetting = useRef(null);
  useEffect(() => {
    const form = trigger.current?.form;
    const reset = (event) => {
      resetting.current = event;
      queueMicrotask(() => {
        resetting.current = null;
      });
    };
    form?.addEventListener("reset", reset, true);
    return () => form?.removeEventListener("reset", reset, true);
  }, []);
  return (
    <Primitive.Root
      dir={dir}
      value={current}
      defaultValue={initial}
      required={required}
      disabled={disabled}
      onValueChange={(next) => {
        // Radix resets even when a failed server action cancels the form reset.
        const reset = resetting.current;
        if (reset) {
          queueMicrotask(() => {
            if (!reset.defaultPrevented) setInternal(next);
          });
          return;
        }
        setInternal(next);
        const value = next === emptyValue ? "" : next;
        onValueChange?.(value);
      }}
    >
      {name && (
        <input
          type="hidden"
          name={name}
          value={current === emptyValue ? "" : current}
          disabled={disabled}
        />
      )}
      <Primitive.Trigger
        ref={trigger}
        {...props}
        data-select-name={name}
        className={`ui-select ui-button ui-button--soft ${className}`}
      >
        <Primitive.Value placeholder={placeholder?.children} />
        <Primitive.Icon asChild>
          <ChevronDown size={18} aria-hidden="true" />
        </Primitive.Icon>
      </Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Content
          className="ui-select__content"
          dir={dir}
          position="popper"
          sideOffset={8}
          collisionPadding={12}
        >
          <Primitive.ScrollUpButton className="ui-select__scroll">
            <ChevronUp size={18} />
          </Primitive.ScrollUpButton>
          <Primitive.Viewport className="ui-select__viewport">
            {options
              .filter((option) => option !== placeholder)
              .map((option) => (
                <Primitive.Item
                  key={option.value}
                  value={encode(option.value)}
                  disabled={option.disabled}
                  className="ui-select__item"
                  data-select-value={option.value}
                >
                  <Primitive.ItemText>{option.children}</Primitive.ItemText>
                  <Primitive.ItemIndicator>
                    <Check size={18} aria-hidden="true" />
                  </Primitive.ItemIndicator>
                </Primitive.Item>
              ))}
          </Primitive.Viewport>
          <Primitive.ScrollDownButton className="ui-select__scroll">
            <ChevronDown size={18} />
          </Primitive.ScrollDownButton>
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
