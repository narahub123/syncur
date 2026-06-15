import { SortOrder } from "@/shared/types/pagination";

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
  limit: number;

  search: string;
  searchField: AdminFaqSearchField;

  sort?: AdminFaqSort;
  sortOrder?: SortOrder;
}
