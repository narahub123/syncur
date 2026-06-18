export const COLUMN_ALIGN = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
};

export type ColumnAlignType = (typeof COLUMN_ALIGN)[keyof typeof COLUMN_ALIGN];

export interface Column<T, K extends string> {
  key: K;
  header: string;
  render: (item: T) => React.ReactNode;
  align?: ColumnAlignType;
  sortable?: boolean; // 정렬 가능 여부를 명시적으로 제어
}
