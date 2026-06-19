import { SortOrder } from "@/shared/types/pagination";
import { FILTER_TYPES, FilterValue } from "../../constants/filters";

/**
 * NOTICE_CATEGORY 상수 객체
 */
export const NOTICE_CATEGORY = {
  GENERAL: "GENERAL",
  SERVICE: "SERVICE",
  EVENT: "EVENT",
  MAINTENANCE: "MAINTENANCE",
} as const;

export type NoticeCategory =
  (typeof NOTICE_CATEGORY)[keyof typeof NOTICE_CATEGORY];

/**
 * NOTICE_CATEGORY 라벨 객체
 */
export const NOTICE_CATEGORY_LABELS: Record<NoticeCategory, string> = {
  [NOTICE_CATEGORY.GENERAL]: "일반 공지",
  [NOTICE_CATEGORY.SERVICE]: "서비스 안내",
  [NOTICE_CATEGORY.EVENT]: "이벤트",
  [NOTICE_CATEGORY.MAINTENANCE]: "점검 안내",
};

/**
 * 선택용 옵션 배열 (자동 생성)
 */
export const NOTICE_CATEGORY_OPTIONS = Object.entries(
  NOTICE_CATEGORY_LABELS,
).map(([value, label]) => ({ value, label }));

/**
 * NoticePinStatus 상수 객체
 */
export const NOTICE_PIN_STATUS = {
  FIXED: "fixed",
  NORMAL: "normal",
} as const;

export type NoticePinStatus =
  (typeof NOTICE_PIN_STATUS)[keyof typeof NOTICE_PIN_STATUS];

/**
 * NoticePinStatus 라벨 객체
 */
export const NOTICE_PIN_STATUS_LABELS: Record<NoticePinStatus, string> = {
  [NOTICE_PIN_STATUS.FIXED]: "상단 고정",
  [NOTICE_PIN_STATUS.NORMAL]: "일반 공지",
};

/**
 * 선택용 옵션 배열 (자동 생성)
 */
export const NOTICE_PIN_STATUS_OPTIONS = Object.entries(
  NOTICE_PIN_STATUS_LABELS,
).map(([value, label]) => ({ value, label }));

/**
 * 검색 필드 상수
 */
export const ADMIN_NOTICE_SEARCH_FIELD = {
  TITLE: "title",
  CONTENT: "content",
} as const;

export type AdminNoticeSearchField =
  (typeof ADMIN_NOTICE_SEARCH_FIELD)[keyof typeof ADMIN_NOTICE_SEARCH_FIELD];

export const ADMIN_NOTICE_SEARCH_FIELD_LABELS: Record<
  AdminNoticeSearchField,
  string
> = {
  [ADMIN_NOTICE_SEARCH_FIELD.TITLE]: "제목",
  [ADMIN_NOTICE_SEARCH_FIELD.CONTENT]: "내용",
};

export const ADMIN_NOTICE_SEARCH_FIELD_OPTIONS = Object.entries(
  ADMIN_NOTICE_SEARCH_FIELD_LABELS,
).map(([value, label]) => ({ value, label }));

/**
 * 정렬 기준 상수
 */
export const ADMIN_NOTICE_SORT = {
  TITLE: "title",
  CATEGORY: "category",
  VIEWS: "views",
  IS_PINNED: "isPinned",
  CREATED_AT: "createdAt",
  CREATED_BY: "createdBy",
} as const;

export type AdminNoticeSort =
  (typeof ADMIN_NOTICE_SORT)[keyof typeof ADMIN_NOTICE_SORT];

export const ADMIN_NOTICE_SORT_LABELS: Record<AdminNoticeSort, string> = {
  [ADMIN_NOTICE_SORT.TITLE]: "제목순",
  [ADMIN_NOTICE_SORT.CATEGORY]: "카테고리순",
  [ADMIN_NOTICE_SORT.VIEWS]: "조회수순",
  [ADMIN_NOTICE_SORT.IS_PINNED]: "고정 여부순",
  [ADMIN_NOTICE_SORT.CREATED_AT]: "작성일순",
  [ADMIN_NOTICE_SORT.CREATED_BY]: "작성자순",
};

/**
 * Admin용 페이지 사이즈 상수
 */
export const ADMIN_PAGE_SIZE = {
  DEFAULT: 10,
  TWENTY: 20,
  FIFTY: 50,
  HUNDRED: 100,
} as const;

export type AdminPageSize =
  (typeof ADMIN_PAGE_SIZE)[keyof typeof ADMIN_PAGE_SIZE];

export const ADMIN_PAGE_SIZE_OPTIONS = [
  { value: ADMIN_PAGE_SIZE.DEFAULT, label: "10개씩 보기" },
  { value: ADMIN_PAGE_SIZE.TWENTY, label: "20개씩 보기" },
  { value: ADMIN_PAGE_SIZE.FIFTY, label: "50개씩 보기" },
  { value: ADMIN_PAGE_SIZE.HUNDRED, label: "100개씩 보기" },
];

export const ADMIN_NOTICE_SORT_OPTIONS = Object.entries(
  ADMIN_NOTICE_SORT_LABELS,
).map(([value, label]) => ({ value, label }));

export const adminNoticeInitialFilterValue = {
  category: ["all"],
  isPinned: "all",
  createdAt: { start: null, end: null },
};

export const ADMIN_NOTICE_FILTER_CONFIG = {
  category: {
    label: "카테고리",
    type: FILTER_TYPES.MULTI_SELECT,
    options: [
      { label: "전체", value: "all" },
      ...NOTICE_CATEGORY_OPTIONS, // 아까 만든 상수 활용
    ],
  },
  isPinned: {
    label: "고정 상태",
    type: FILTER_TYPES.SELECT,
    options: [
      { label: "전체", value: "all" },
      { label: "고정됨", value: "true" },
      { label: "일반", value: "false" },
    ],
  },
  createdAt: {
    label: "작성일",
    type: FILTER_TYPES.DATE_RANGE,
  },
} as const;

/**
 * 관리자용 문의 필터 키 타입
 */
export type AdminNoticeFilterKey = keyof typeof ADMIN_NOTICE_FILTER_CONFIG;

export interface AdminNoticeQuery {
  page: number;
  limit: AdminPageSize;
  search: string;
  searchField: AdminNoticeSearchField;
  sort: AdminNoticeSort;
  sortOrder: SortOrder;
  filters: Partial<Record<AdminNoticeFilterKey, FilterValue>>;
}
