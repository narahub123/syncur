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
  isLoading: boolean;
}

export const FilterToolbar = <T extends Record<string, FilterDefinition>>({
  config,
  filters,
  onChange,
  initialValue,
  onReset,
  isLoading,
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

  if (isLoading) return <FilterToolbarSkeleton />;

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

export function FilterToolbarSkeleton() {
  // config의 키 개수를 정확히 알 수 없는 경우, 대략적인 필터 개수(예: 3~4개)를 가정합니다.
  const skeletonItems = [1, 2, 3, 4];

  return (
    <div className="flex animate-pulse items-center gap-2 overflow-x-auto rounded-lg border p-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {skeletonItems.map((i) => (
          <div key={i} className="shrink-0">
            {/* FilterPopoverItem의 버튼 형태를 모방 */}
            <div className="h-9 w-24 rounded-md bg-gray-200" />
          </div>
        ))}
      </div>

      {/* 초기화 버튼 공간 (isDirty 상태일 때를 대비해 미리 공간 확보) */}
      <div className="ml-auto h-9 w-16 shrink-0 rounded-md bg-gray-100" />
    </div>
  );
}
