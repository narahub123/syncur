"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type Option<T extends number> = {
  value: T;
  label: string;
};

type Props<T extends number> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
};

export default function AdminPageSizeSelect<T extends number>({
  value,
  options,
  onChange,
  placeholder = "개수",
}: Props<T>) {
  return (
    <Select
      value={String(value)}
      onValueChange={(v) => onChange(Number(v) as T)}
    >
      <SelectTrigger className="w-30">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={String(opt.value)}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
