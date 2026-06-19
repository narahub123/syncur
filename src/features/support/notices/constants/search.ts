import { AdminNoticeSearchField, AdminNoticeSort } from "@/features/admin/notices/types/search";

/**
 * 관리자 공지사항 검색 필드 옵션
 */
export const ADMIN_NOTICE_SEARCH_FIELD_OPTIONS: {
  label: string;
  value: AdminNoticeSearchField;
}[] = [
  { label: "제목", value: "title" },
  { label: "내용", value: "content" },
];

/**
 * 관리자 공지사항 정렬 옵션
 */
export const ADMIN_NOTICE_SORT_OPTIONS: {
  label: string;
  value: AdminNoticeSort;
}[] = [
  { label: "제목", value: "title" },
  { label: "조회수", value: "views" },
  { label: "고정 여부", value: "isPinned" },
  { label: "작성자", value: "createdBy" },
  { label: "생성일", value: "createdAt" },
];

/**
 * 관리자 공지사항 페이지 사이즈 옵션
 * (FAQ와 동일한 규격 공유 가능)
 */
export const ADMIN_NOTICE_PAGE_SIZE_OPTIONS = [
  { label: "10개", value: 10 as const },
  { label: "20개", value: 20 as const },
  { label: "50개", value: 50 as const },
  { label: "100개", value: 100 as const },
];
