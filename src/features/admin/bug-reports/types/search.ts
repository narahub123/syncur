import { SortOrder } from "@/shared/types/pagination";
import { FILTER_TYPES, FilterValue } from "@/features/admin/constants/filters";

/**
 * Bug Report 상태
 */
export const BUG_REPORT_STATUS = {
  PENDING: "PENDING",
  CHECKING: "CHECKING",
  FIXING: "FIXING",
  COMPLETED: "COMPLETED",
} as const;

export type BugReportStatus =
  (typeof BUG_REPORT_STATUS)[keyof typeof BUG_REPORT_STATUS];

/**
 * 상태 라벨
 */
export const BUG_REPORT_STATUS_LABELS: Record<BugReportStatus, string> = {
  PENDING: "접수대기",
  CHECKING: "확인중",
  FIXING: "수정중",
  COMPLETED: "해결완료",
};

/**
 * 상태 옵션 (UI 전용)
 */
export const BUG_REPORT_STATUS_OPTIONS = Object.entries(
  BUG_REPORT_STATUS_LABELS,
).map(([value, label]) => ({
  value,
  label,
}));

/**
 * 검색 필드
 */
export const BUG_REPORT_SEARCH_FIELD = {
  TITLE: "title",
  CONTENT: "content",
  USER: "user",
} as const;

export type BugReportSearchField =
  (typeof BUG_REPORT_SEARCH_FIELD)[keyof typeof BUG_REPORT_SEARCH_FIELD];

export const BUG_REPORT_SEARCH_FIELD_LABELS: Record<
  BugReportSearchField,
  string
> = {
  title: "제목",
  content: "내용",
  user: "사용자",
};

export const BUG_REPORT_SEARCH_FIELD_OPTIONS = Object.entries(
  BUG_REPORT_SEARCH_FIELD_LABELS,
).map(([value, label]) => ({
  value,
  label,
}));

/**
 * 정렬
 */
export const BUG_REPORT_SORT = {
  STATUS: "status",
  TITLE: "title",
  USER: "user",
  CREATED_AT: "createdAt",
} as const;

export type BugReportSort =
  (typeof BUG_REPORT_SORT)[keyof typeof BUG_REPORT_SORT];

export const BUG_REPORT_SORT_LABELS: Record<BugReportSort, string> = {
  status: "상태순",
  title: "제목순",
  user: "사용자순",
  createdAt: "작성일순",
};

/**
 * 페이지 사이즈
 */
export const BUG_REPORT_PAGE_SIZE = {
  DEFAULT: 10,
  TWENTY: 20,
  FIFTY: 50,
} as const;

export type BugReportPageSize =
  (typeof BUG_REPORT_PAGE_SIZE)[keyof typeof BUG_REPORT_PAGE_SIZE];

export const BUG_REPORT_PAGE_SIZE_OPTIONS = Object.entries(
  BUG_REPORT_PAGE_SIZE,
).map(([_, value]) => ({
  label: `${value}개`,
  value,
}));

/**
 * 필터 초기값
 */
export const bugReportInitialFilterValue = {
  status: ["all"],
};

/**
 * 🔥 핵심: FILTER_CONFIG (options 반드시 유지)
 */
export const BUG_REPORT_FILTER_CONFIG = {
  status: {
    label: "처리 상태",
    type: FILTER_TYPES.MULTI_SELECT,
    options: [
      { label: "전체", value: "all" as const },
      ...BUG_REPORT_STATUS_OPTIONS,
    ],
  },
} as const;

export type BugReportFilterKey = keyof typeof BUG_REPORT_FILTER_CONFIG;

/**
 * Query
 */
export interface BugReportQuery {
  page: number;
  limit: BugReportPageSize;
  search: string;
  searchField: BugReportSearchField;
  sort: BugReportSort;
  sortOrder: SortOrder;
  filters: Partial<Record<BugReportFilterKey, FilterValue>>;
}
