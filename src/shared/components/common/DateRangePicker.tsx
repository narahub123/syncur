"use client";
import { DateRange } from "@/features/admin/constants/filters";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (value: DateRange) => void;
}

export const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  return (
    <div className="flex items-center gap-2">
      <DatePicker
        selected={value?.start ?? null}
        onChange={(date: Date | null) =>
          onChange({ ...value, start: date, end: value?.end ?? null })
        }
        selectsStart
        startDate={value?.start ?? null}
        endDate={value?.end ?? null}
        placeholderText="시작일"
        dateFormat="yyyy/MM/dd"
        className="h-8 w-24 rounded border p-2 text-sm"
      />
      <span>~</span>
      <DatePicker
        selected={value?.end ?? null}
        onChange={(date: Date | null) =>
          onChange({ ...value, start: value?.start ?? null, end: date })
        }
        selectsEnd
        startDate={value?.start ?? null}
        endDate={value?.end ?? null}
        minDate={value?.start ?? undefined}
        dateFormat="yyyy/MM/dd"
        placeholderText="종료일"
        className="h-8 w-24 rounded border p-2 text-sm"
      />
    </div>
  );
};
