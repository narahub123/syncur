import { DateRangePicker } from "@/shared/components/common/DateRangePicker";
import { FilterDefinition, FilterValue } from "../constants/filters";
import { CommonSelect } from "@/shared/components/common/CommonSelect";
import { CommonMultiSelect } from "@/shared/components/common/CommonMultiSelect";

interface FilterBarProps<T extends Record<string, FilterDefinition>> {
  config: T; // 외부에서 주입받음
  filters: Partial<Record<keyof T, FilterValue>>;
  onChange: (key: keyof T, value: FilterValue) => void;
  initialValue?: Partial<Record<keyof T, FilterValue>>;
}

export const FilterBar = <T extends Record<string, FilterDefinition>>({
  config,
  filters,
  onChange,
  initialValue,
}: FilterBarProps<T>) => {
  const handleReset = () => {
    (Object.keys(config) as Array<keyof T>).forEach((key) => {
      // 각 타입에 맞는 기본값으로 초기화 (보통 null, undefined, 또는 빈 배열)
      const type = config[key].type;
      if (type === "multi-select") {
        onChange(key, initialValue?.[key] ?? []);
      } else if (type === "date-range") {
        onChange(key, initialValue?.[key] ?? { start: null, end: null });
      } else {
        onChange(key, initialValue?.[key] ?? ""); // select 등
      }
    });
  };

  // 현재 필터가 초기 상태와 다른지 확인하는 로직
  const isDirty = (Object.keys(config) as Array<keyof T>).some((key) => {
    return filters[key] !== (initialValue?.[key] ?? "");
  });

  return (
    <div className="flex flex-col justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:flex md:flex-row md:items-center">
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
                    value as
                      | { start: Date | null; end: Date | null }
                      | undefined
                  }
                  onChange={(val) => onChange(key, val)}
                />
              )}
            </div>
          );
        })}
      </div>
      {isDirty && (
        <button
          onClick={handleReset}
          className="mt-2 flex w-full shrink-0 items-center gap-1 text-sm text-gray-500 transition-colors hover:text-red-600 md:mt-0 md:w-auto"
        >
          <span>↺ 초기화</span>
        </button>
      )}
    </div>
  );
};
