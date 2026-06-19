import { FILTER_TYPES, FilterValue } from "../../constants/filters";
import { SortOrder } from "@/shared/types/pagination";

export const FAQ_CATEGORIES = {
  PAYMENT: "payment",
  USAGE: "usage",
  BUG: "bug",
  ETC: "etc",
} as const;

// 1. 카테고리 정의 객체 (상수)
// Key는 식별자, Value는 화면 표시용 명칭입니다.
export const FAQ_CATEGORY_LABELS = {
  [FAQ_CATEGORIES.PAYMENT]: "결제",
  [FAQ_CATEGORIES.USAGE]: "이용문의",
  [FAQ_CATEGORIES.BUG]: "버그신고",
  [FAQ_CATEGORIES.ETC]: "기타",
} as const;

// 2. 이 객체의 Value들만 추출하여 타입으로 생성
export type FaqCategory = (typeof FAQ_CATEGORIES)[keyof typeof FAQ_CATEGORIES];

// 3. (옵션) 폼 옵션 생성용 배열 자동 생성
// Object.entries를 활용해 코드 한 번으로 폼 옵션을 만듭니다.
export const FAQ_CATEGORY_OPTIONS = Object.entries(FAQ_CATEGORY_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

export const FaqPublishOptions = [
  { value: "published", label: "공개" },
  { value: "secure", label: "비공개" },
];

export const adminFaqInitialFilterValue = {
  category: ["all"],
  isPublished: "all",
  createdAt: { start: null, end: null },
};

export const ADMIN_FAQ_FILTER_CONFIG = {
  category: {
    label: "카테고리",
    type: FILTER_TYPES.MULTI_SELECT,
    options: [
      { label: "전체", value: "all" },
      { label: "결제", value: "payment" },
      { label: "이용문의", value: "usage" },
      { label: "버그신고", value: "bug" },
      { label: "기타", value: "etc" },
    ],
  },
  isPublished: {
    label: "공개 상태",
    type: FILTER_TYPES.SELECT,
    options: [
      { label: "전체", value: "all" },
      { label: "공개", value: "true" },
      { label: "비공개", value: "false" },
    ],
  },
  createdAt: {
    label: "작성일",
    type: FILTER_TYPES.DATE_RANGE,
  },
} as const;

export type AdminFaqFilterKey = keyof typeof ADMIN_FAQ_FILTER_CONFIG;

/**
 * 관리자 FAQ 검색 필드
 */
export type AdminFaqSearchField = "question" | "category";

/**
 * 관리자 FAQ 정렬 필드
 */
export type AdminFaqSort =
  | "question"
  | "category"
  | "isPublished"
  | "sortOrder"
  | "createdAt";

export type AdminFaqPageSize = 10 | 20 | 50 | 100;

/**
 * 관리자 FAQ 조회 Query
 */

export interface AdminFaqsQuery {
  page: number;
  limit: AdminFaqPageSize;

  search: string;
  searchField: AdminFaqSearchField;

  sort: AdminFaqSort;
  sortOrder: SortOrder;
  filters: Partial<Record<AdminFaqFilterKey, FilterValue>>;
}

/**
 * 관리자 FAQ 검색 필드 옵션
 */
export const ADMIN_FAQ_SEARCH_FIELD_OPTIONS: {
  label: string;
  value: AdminFaqSearchField;
}[] = [
  { label: "질문", value: "question" },
  { label: "카테고리", value: "category" },
];

/**
 * 관리자 FAQ 정렬 옵션
 */
export const ADMIN_FAQ_SORT_OPTIONS: {
  label: string;
  value: AdminFaqSort;
}[] = [
  { label: "질문", value: "question" },
  { label: "카테고리", value: "category" },
  { label: "공개 여부", value: "isPublished" },
  { label: "순서", value: "sortOrder" },
  { label: "생성일", value: "createdAt" },
];

/**
 * 관리자 FAQ 페이지 사이즈 옵션
 */
export const ADMIN_FAQ_PAGE_SIZE_OPTIONS: {
  label: string;
  value: AdminFaqPageSize;
}[] = [
  { label: "10개", value: 10 },
  { label: "20개", value: 20 },
  { label: "50개", value: 50 },
  { label: "100개", value: 100 },
];

export type FaqPinStatus = "published" | "secure";
