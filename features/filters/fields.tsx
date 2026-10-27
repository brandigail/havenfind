"use client";

import { useId } from "react";

interface Option {
  value: number;
  label: string;
}

interface NumberSelectProps {
  label: string;
  value: number | undefined;
  options: Option[];
  anyLabel: string;
  onChange: (value: number | undefined) => void;
}

const controlClass =
  "w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900";

export function NumberSelect({ label, value, options, anyLabel, onChange }: NumberSelectProps) {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </label>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        className={controlClass}
      >
        <option value="">{anyLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface ToggleGroupProps<T extends string> {
  legend: string;
  options: readonly { value: T; label: string }[];
  selected: readonly T[];
  onChange: (next: T[]) => void;
}

export function ToggleGroup<T extends string>({ legend, options, selected, onChange }: ToggleGroupProps<T>) {
  const toggle = (value: T): void =>
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const on = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(option.value)}
              className={`rounded-full border px-3 py-1 text-xs transition focus-visible:outline-2 focus-visible:outline-teal-600 ${
                on
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-zinc-300 hover:border-teal-600 dark:border-zinc-700"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
