import { SortOrder } from "mongoose";

/**
 * 관리자 알림 검색 필드
 */
export type AdminNotificationSearchField = "title" | "message" | "type";

/**
 * 관리자 알림 정렬 필드
 */
export type AdminNotificationSort = "title" | "type" | "isRead" | "createdAt";

export type AdminNotificationPageSize = 10 | 20 | 50 | 100;

/**
 * 관리자 알림 조회 Query
 */
export interface AdminNotificationsQuery {
  page: number;
  limit: number;

  search: string;
  searchField: AdminNotificationSearchField;

  sort?: AdminNotificationSort;
  sortOrder?: SortOrder;
}
