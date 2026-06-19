// 필터 타입 정의
export type FilterValue =
  | string
  | string[]
  | DateRange
  | NumberRange
  | undefined;

export interface NumberRange {
  min: number | null;
  max: number | null;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export const FILTER_TYPES = {
  SELECT: "select",
  MULTI_SELECT: "multi-select",
  DATE_RANGE: "date-range",
  NUMBER_RANGE: "number-range",
};

export type FilterType = (typeof FILTER_TYPES)[keyof typeof FILTER_TYPES];

export interface FilterDefinition {
  label: string;
  type: FilterType;
  options?: readonly { readonly label: string; readonly value: string }[];
  min?: number;
  max?: number;
}
