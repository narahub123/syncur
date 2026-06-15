import {
  AdminFaqPageSize,
  AdminFaqSearchField,
  AdminFaqSort,
} from "@/features/support/faqs/types/search";

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
