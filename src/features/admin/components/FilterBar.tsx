import { DateRangePicker } from "@/shared/components/common/DateRangePicker";
import { FilterDefinition, FilterValue } from "../constants/filters";
import { CommonSelect } from "@/shared/components/common/CommonSelect";
import { CommonMultiSelect } from "@/shared/components/common/CommonMultiSelect";

interface FilterBarProps<T extends Record<string, FilterDefinition>> {
  config: T; // 외부에서 주입받음
  filters: Partial<Record<keyof T, FilterValue>>;
  onChange: (key: keyof T, value: FilterValue) => void;
}

export const FilterBar = <T extends Record<string, FilterDefinition>>({
  config,
  filters,
  onChange,
}: FilterBarProps<T>) => {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border p-4">
      {(Object.keys(config) as Array<keyof T>).map((key) => {
        const item = config[key]; // 각 필터의 설정값 (label, type)
        const value = filters[key]; // 현재 적용된 값

        return (
          <div key={String(key)} className="flex items-center gap-2">
            <label className="text-sm font-semibold">{item.label}</label>

            {item.type === "select" && item.options && (
              <CommonSelect
                options={item.options}
                value={value as string}
                onChange={(val) => onChange(key, val)}
              />
            )}

            {item.type === "multi-select" && item.options && (
              <CommonMultiSelect
                options={item.options}
                selected={(value as string[]) ?? []}
                onChange={(vals) => onChange(key, vals)}
              />
            )}

            {item.type === "date-range" && (
              <DateRangePicker
                value={
                  value as { start: Date | null; end: Date | null } | undefined
                }
                onChange={(val) => onChange(key, val)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
