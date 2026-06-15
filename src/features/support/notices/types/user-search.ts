import { SortOrder } from "@/shared/types/pagination";
import {
  RequestStatus,
  RequestType,
} from "../../requests/constants/request-type";

/**
 * 1. 유저용 공지사항(Notice) 쿼리 규격
 */
export type UserNoticeSearchField = "title" | "content";
export type UserNoticeSort = "title" | "views" | "createdAt";

export interface UserNoticeQuery {
  page: number;
  limit: number;
  search?: string;
  searchField?: UserNoticeSearchField;
  sort?: UserNoticeSort;
  sortOrder?: SortOrder;
}

/**
 * 2. 유저용 1:1 문의/버그(Request) 쿼리 규격
 */
export type UserRequestSearchField = "title" | "content";
export type UserRequestSort = "title" | "status" | "createdAt";

export interface UserRequestQuery {
  page: number;
  limit: number;
  search?: string;
  searchField?: UserRequestSearchField;
  sort?: UserRequestSort;
  sortOrder?: SortOrder;
  type?: RequestType; // 본인 내역 중 문의/버그 필터링용
  status?: RequestStatus; // 본인 내역 중 처리 상태 필터링용
}
