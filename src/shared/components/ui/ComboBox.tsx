"use client";

import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import { useEffect, useMemo, useRef, useState, KeyboardEvent } from "react";
import { cn } from "@/shared/utils/cn";
import { Input } from "./Input";

export type ComboboxOption = {
  label: string;
  value: string;
};

type Props = {
  options: ComboboxOption[];

  value?: string;
  defaultValue?: string;

  placeholder?: string;

  onChange?: (value: string, option: ComboboxOption | null) => void;

  disabled?: boolean;

  className?: string;
  inputClassName?: string;
  listClassName?: string;
};

export const Combobox = ({
  options,
  value,
  defaultValue,
  placeholder = "Select...",
  onChange,
  disabled,
  className,
  inputClassName,
  listClassName,
}: Props) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const isControlled = value !== undefined;

  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedValue = isControlled ? value! : internalValue;

  const selectedOption = useMemo(() => {
    return options.find((o) => o.value === selectedValue) ?? null;
  }, [options, selectedValue]);

  const filteredOptions = useMemo(() => {
    if (!query) return options;
    return options.filter((o) => {
      console.log("쿼리 값", query);
      return o.label.toLowerCase().includes(query.toLowerCase());
    });
  }, [options, query]);

  const { refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(6), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const setValue = (option: ComboboxOption) => {
    if (!isControlled) setInternalValue(option.value);
    onChange?.(option.value, option);
    setQuery(option.label);
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;

      case "Enter":
        e.preventDefault();
        const option = filteredOptions[activeIndex];
        if (option) setValue(option);
        break;

      case "Escape":
        setOpen(false);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!rootRef.current) return;

      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    setOpen(true);
    setActiveIndex(0);
  };

  return (
    <div className={cn("relative w-full", className)} ref={rootRef}>
      <div ref={refs.setReference}>
        <Input
          ref={inputRef}
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full rounded-md border px-3 py-2 outline-none",
            "focus:ring-2 focus:ring-blue-500",
            inputClassName,
          )}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls="combobox-listbox"
          aria-activedescendant={
            filteredOptions[activeIndex]
              ? `combobox-option-${filteredOptions[activeIndex].value}`
              : undefined
          }
        />

        {open && filteredOptions.length > 0 && (
          <div
            ref={refs.setFloating}
            role="listbox"
            id="combobox-listbox"
            style={floatingStyles}
            className={cn(
              "z-50 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-md",
              listClassName,
            )}
          >
            {filteredOptions.map((option, idx) => (
              <div
                role="option"
                aria-selected={idx === activeIndex}
                id={`combobox-option-${option.value}`}
                key={option.value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setValue(option);
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                className={cn(
                  "cursor-pointer px-3 py-2 text-sm",
                  idx === activeIndex && "bg-gray-100",
                  option.value === selectedOption?.value &&
                    "color-primary-active",
                )}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
