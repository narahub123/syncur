"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/shared/components/ui/command";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Check } from "lucide-react";

interface Props {
  options: readonly { label: string; value: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export const CommonMultiSelect = ({ options, selected, onChange }: Props) => {
  const hasAllOption = options.some((opt) => opt.value === "all");

  const toggle = (val: string) => {
    // 1. ALL 선택 시
    if (val === "all") {
      onChange(["all"]);
      return;
    }

    // 2. ALL 상태에서 다른 값 선택 시
    if (selected.includes("all")) {
      onChange([val]);
      return;
    }

    // 3. 일반 toggle
    const next = selected.includes(val)
      ? selected.filter((s) => s !== val)
      : [...selected, val];

    // 4. 빈 상태 처리
    if (next.length === 0 && hasAllOption) {
      onChange(["all"]);
      return;
    }

    onChange(next);
  };

  const getLabel = (value: string) =>
    options.find((opt) => opt.value === value)?.label ?? value;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex h-8 max-w-100 flex-wrap justify-start gap-2"
        >
          {selected.length === 0 || selected.includes("all") ? (
            <span>전체</span>
          ) : (
            selected.map((s) => <Badge key={s}>{getLabel(s)}</Badge>)
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="검색..." />
          <CommandList>
            {options.map((opt) => (
              <CommandItem key={opt.value} onSelect={() => toggle(opt.value)}>
                <Check
                  className={`mr-2 ${
                    selected.includes(opt.value) ? "opacity-100" : "opacity-0"
                  }`}
                />
                {opt.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
