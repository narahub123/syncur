"use client";

import { Input } from "@/shared/components/ui/input";
import { NumberRange } from "../constants/filters";

interface NumberRangePickerProps {
  value: NumberRange | undefined;
  onChange: (value: NumberRange) => void;
  min?: number;
  max?: number;
}

export const NumberRangePicker = ({
  value,
  onChange,
  min,
  max,
}: NumberRangePickerProps) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        placeholder="최소"
        value={value?.min ?? ""}
        onChange={(e) =>
          onChange({
            min: e.target.value === "" ? null : Number(e.target.value),
            max: value?.max ?? null,
          })
        }
        min={min}
        max={max}
        className="h-8 w-24"
      />

      <span>~</span>

      <Input
        type="number"
        placeholder="최대"
        value={value?.max ?? ""}
        onChange={(e) =>
          onChange({
            min: value?.min ?? null,
            max: e.target.value === "" ? null : Number(e.target.value),
          })
        }
        min={min}
        max={max}
        className="h-8 w-24"
      />
    </div>
  );
};
