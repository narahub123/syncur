import { SortOrder } from "@/shared/types/pagination";
import { UserNoticeSearchField } from "../types/user-search";

/**
 * 2. 유저 공지사항 검색 필드 옵션
 */
export const USER_NOTICE_SEARCH_FIELD_OPTIONS: {
  label: string;
  value: UserNoticeSearchField;
}[] = [
  { label: "제목", value: "title" },
  { label: "내용", value: "content" },
];

/**
 * 3. 유저 공지사항 페이지 사이즈 옵션
 */
export const USER_NOTICE_PAGE_SIZE_OPTIONS = [
  { label: "10개", value: 10 as const },
  { label: "20개", value: 20 as const },
  { label: "50개", value: 50 as const },
  { label: "100개", value: 100 as const },
];
