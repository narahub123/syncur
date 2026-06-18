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
  const toggle = (val: string) => {
    onChange(
      selected.includes(val)
        ? selected.filter((s) => s !== val)
        : [...selected, val],
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex h-8 max-w-100 flex-wrap justify-start gap-2"
        >
          {selected.length === 0
            ? "선택하세요"
            : selected.map((s) => <Badge key={s}>{s}</Badge>)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="검색..." />
          <CommandList>
            {options.map((opt) => (
              <CommandItem key={opt.value} onSelect={() => toggle(opt.value)}>
                <Check
                  className={`mr-2 ${selected.includes(opt.value) ? "opacity-100" : "opacity-0"}`}
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
