import { SortOrder } from "@/shared/types/pagination";
import { FilterValue } from "../../constants/filters";

/**
 * 사이트 관리 검색 필드 상수
 */
export const ADMIN_SITE_SEARCH_FIELDS = {
  NAME: "name",
  URL: "url",
} as const;

/**
 * 사이트 관리 검색 필드 옵션
 */
export const ADMIN_SITE_SEARCH_FIELD_OPTIONS: {
  label: string;
  value: AdminSiteSearchField;
}[] = [
  { label: "사이트명", value: ADMIN_SITE_SEARCH_FIELDS.NAME },
  { label: "URL", value: ADMIN_SITE_SEARCH_FIELDS.URL },
];

/**
 * 사이트 관리 정렬 필드 상수
 * 서버 API가 정렬 기준(sort)으로 받아들이는 키값을 그대로 정의합니다.
 */
export const ADMIN_SITE_SORT_FIELDS = {
  NAME: "name",
  URL: "url",
  STATUS: "status", // 서버가 정렬 기준으로 인식하는 키
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
} as const;

// 상수로부터 타입 추출
export type AdminSiteSearchField =
  (typeof ADMIN_SITE_SEARCH_FIELDS)[keyof typeof ADMIN_SITE_SEARCH_FIELDS];
export type AdminSiteSort =
  (typeof ADMIN_SITE_SORT_FIELDS)[keyof typeof ADMIN_SITE_SORT_FIELDS];

/**
 * 사이트 관리 페이지 사이즈 옵션
 * 공지사항과 동일한 규격을 유지하되, 별도의 상수로 분리
 */
export const ADMIN_SITE_PAGE_SIZE_OPTIONS = [
  { label: "10개", value: 10 as const },
  { label: "20개", value: 20 as const },
  { label: "50개", value: 50 as const },
  { label: "100개", value: 100 as const },
];

export type AdminSitePageSize =
  (typeof ADMIN_SITE_PAGE_SIZE_OPTIONS)[number]["value"];

export const AdminSiteInitialFilterValue = {
  hasFeed: "all",
};

export const ADMIN_SITE_FILTER_CONFIG = {
  hasFeed: {
    label: "RSS",
    type: "select",
    options: [
      { label: "전체", value: "all" },
      { label: "지원", value: "true" },
      { label: "미지원", value: "false" },
    ],
  },
  createdAt: { label: "등록 기간", type: "date-range" },
} as const;

export type AdminSiteFilterKey = keyof typeof ADMIN_SITE_FILTER_CONFIG;

/**
 * 사이트 관리 쿼리 인터페이스
 */
export interface AdminSiteQuery {
  page: number;
  limit: AdminSitePageSize;
  search: string;
  searchField: AdminSiteSearchField;
  sort: AdminSiteSort;
  sortOrder: SortOrder;
  filters: Partial<Record<AdminSiteFilterKey, FilterValue>>;
}
