"use client";

import { Button } from "@/shared/components/ui/button";
import {
  FILTER_TYPES,
  FilterDefinition,
  FilterValue,
} from "../constants/filters";
import { FilterPopoverItem } from "./FilterPopoverItem";

interface Props<T extends Record<string, FilterDefinition>> {
  config: T;
  filters: Partial<Record<keyof T, FilterValue>>;
  onChange: (key: keyof T, value: FilterValue) => void;
  initialValue?: Partial<Record<keyof T, FilterValue>>;
  onReset?: () => void;
}

export const FilterToolbar = <T extends Record<string, FilterDefinition>>({
  config,
  filters,
  onChange,
  initialValue,
  onReset,
}: Props<T>) => {
  const keys = Object.keys(config) as Array<keyof T>;

  const isDirty = keys.some((key) => filters[key] != null);

  const handleReset = () => {
    if (onReset) {
      onReset();
      return;
    }

    (Object.keys(config) as Array<keyof T>).forEach((key) => {
      const type = config[key].type;

      if (type === FILTER_TYPES.MULTI_SELECT) {
        onChange(key, initialValue?.[key] ?? []);
      } else if (type === FILTER_TYPES.DATE_RANGE) {
        onChange(key, initialValue?.[key] ?? { start: null, end: null });
      } else if (type === FILTER_TYPES.NUMBER_RANGE) {
        onChange(key, initialValue?.[key] ?? { min: null, max: null });
      } else {
        onChange(key, initialValue?.[key] ?? "");
      }
    });
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto rounded-lg border p-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {keys.map((key) => (
          <div key={String(key)} className="shrink-0">
            <FilterPopoverItem
              label={config[key].label}
              config={config[key]}
              value={filters[key]}
              onChange={(val) => onChange(key, val)}
            />
          </div>
        ))}
      </div>

      {isDirty && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="ml-auto shrink-0"
        >
          초기화
        </Button>
      )}
    </div>
  );
};
