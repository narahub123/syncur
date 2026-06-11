"use client";

import { useState } from "react";

type Props = {
  value: number;
  max: number;
  min?: number;
  disabled?: boolean;
  onSubmit: (value: number) => void;
};

export default function FeedErrorCountInput({
  value,
  max,
  min = 0,
  disabled,
  onSubmit,
}: Props) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (v: number) => {
    if (v <= max && v >= min) {
      setLocalValue(v);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={localValue}
        disabled={disabled}
        min={min}
        max={max}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="w-12 rounded border px-2 py-1 text-sm"
      />

      <button
        type="button"
        disabled={disabled || localValue === value}
        onClick={() => onSubmit(localValue)}
        className="rounded bg-black px-2 py-1 text-xs text-white disabled:opacity-50"
      >
        저장
      </button>
    </div>
  );
}
