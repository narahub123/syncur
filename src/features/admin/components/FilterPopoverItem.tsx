import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import {
  DateRange,
  FILTER_TYPES,
  FilterDefinition,
  FilterValue,
  NumberRange,
} from "../constants/filters";

import { CommonSelect } from "@/shared/components/common/CommonSelect";
import { CommonMultiSelect } from "@/shared/components/common/CommonMultiSelect";
import { DateRangePicker } from "@/shared/components/common/DateRangePicker";
import { NumberRangePicker } from "./NumberRangePicker";

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
      case FILTER_TYPES.SELECT:
        return (
          <CommonSelect
            options={config.options ?? []}
            value={value as string}
            onChange={onChange}
          />
        );

      case FILTER_TYPES.MULTI_SELECT:
        return (
          <CommonMultiSelect
            options={config.options ?? []}
            selected={(value as string[]) ?? []}
            onChange={onChange}
          />
        );

      case FILTER_TYPES.DATE_RANGE:
        return (
          <DateRangePicker
            value={value as DateRange | undefined}
            onChange={onChange}
          />
        );

      case FILTER_TYPES.NUMBER_RANGE:
        return (
          <NumberRangePicker
            value={value as NumberRange | undefined}
            onChange={onChange}
            min={config.min}
            max={config.max}
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
