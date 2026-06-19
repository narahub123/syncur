import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { FilterDefinition, FilterValue } from "../constants/filters";

import { CommonSelect } from "@/shared/components/common/CommonSelect";
import { CommonMultiSelect } from "@/shared/components/common/CommonMultiSelect";
import {
  DateRange,
  DateRangePicker,
} from "@/shared/components/common/DateRangePicker";

interface Props {
  label: string;
  config: FilterDefinition;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

export const FilterPopoverItem = ({
  label,
  config,
  value,
  onChange,
}: Props) => {
  const renderContent = () => {
    switch (config.type) {
      case "select":
        return (
          <CommonSelect
            options={config.options ?? []}
            value={value as string}
            onChange={onChange}
          />
        );

      case "multi-select":
        return (
          <CommonMultiSelect
            options={config.options ?? []}
            selected={(value as string[]) ?? []}
            onChange={onChange}
          />
        );

      case "date-range":
        return (
          <DateRangePicker
            value={value as DateRange | undefined}
            onChange={onChange}
          />
        );
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          {label}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-3">{renderContent()}</PopoverContent>
    </Popover>
  );
};
