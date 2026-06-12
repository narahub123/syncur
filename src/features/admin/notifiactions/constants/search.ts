import {
  AdminNotificationSearchField,
  AdminNotificationSort,
  AdminNotificationPageSize,
} from "../types";

/**
 * 관리자 알림 검색 필드 옵션
 */
export const ADMIN_NOTIFICATION_SEARCH_FIELD_OPTIONS: {
  label: string;
  value: AdminNotificationSearchField;
}[] = [
  { label: "제목", value: "title" },
  { label: "내용", value: "message" },
  { label: "타입", value: "type" },
];

/**
 * 관리자 알림 정렬 옵션
 */
export const ADMIN_NOTIFICATION_SORT_OPTIONS: {
  label: string;
  value: AdminNotificationSort;
}[] = [
  { label: "제목", value: "title" },
  { label: "타입", value: "type" },
  { label: "읽음 여부", value: "isRead" },
  { label: "생성일", value: "createdAt" },
];

/**
 * 관리자 알림 페이지 사이즈 옵션
 */
export const ADMIN_NOTIFICATION_PAGE_SIZE_OPTIONS: {
  label: string;
  value: AdminNotificationPageSize;
}[] = [
  { label: "10개", value: 10 },
  { label: "20개", value: 20 },
  { label: "50개", value: 50 },
  { label: "100개", value: 100 },
];
