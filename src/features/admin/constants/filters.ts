// 필터 타입 정의
export type FilterValue =
  | string
  | string[]
  | { start: Date | null; end: Date | null }
  | undefined;

export const FILTER_TYPES = {
  SELECT: "select",
  MULTI_SELECT: "multi-select",
  DATA_RANGE: "date-range",
};

export type FilterType = (typeof FILTER_TYPES)[keyof typeof FILTER_TYPES];

export interface FilterDefinition {
  label: string;
  type: FilterType;
  options?: readonly { readonly label: string; readonly value: string }[];
}
