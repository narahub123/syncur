"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/shared/components/ui/command";
import { cn } from "@/shared/utils/cn";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
};

export const MultiSelect = ({ options, value, onChange }: Props) => {
  const [open, setOpen] = useState(false);

  const toggle = (selected: string) => {
    if (selected === "ALL") {
      onChange(["ALL"]);
      return;
    }

    const filtered = value.filter((v) => v !== "ALL");

    if (filtered.includes(selected)) {
      onChange(filtered.filter((v) => v !== selected));
    } else {
      onChange([...filtered, selected]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-48 justify-between"
        >
          {value.length === 0 || value.includes("ALL")
            ? "전체"
            : `${value.length}개 선택됨`}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => toggle(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(option.value) ? "opacity-100" : "opacity-0",
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
