/**
 * 2. 유저용 1:1 문의/버그(Request) 쿼리 규격
 */

import { FILTER_TYPES } from "@/features/admin/constants/filters";
import {
  REQUEST_STATUS,
  REQUEST_TYPE,
  RequestStatus,
  RequestType,
} from "../constants/request-type";
import { SortOrder } from "mongoose";

/**
 * 사용자 문의 검색 필드
 */
export const USER_REQUEST_SEARCH_FIELD = {
  TITLE: "title",
  CONTENT: "content",
} as const;

export type UserRequestSearchField =
  (typeof USER_REQUEST_SEARCH_FIELD)[keyof typeof USER_REQUEST_SEARCH_FIELD];

export const USER_REQUEST_SEARCH_FIELD_LABELS: Record<
  UserRequestSearchField,
  string
> = {
  [USER_REQUEST_SEARCH_FIELD.TITLE]: "제목",
  [USER_REQUEST_SEARCH_FIELD.CONTENT]: "내용",
};

export const USER_REQUEST_SEARCH_FIELD_OPTIONS = Object.entries(
  USER_REQUEST_SEARCH_FIELD_LABELS,
).map(([value, label]) => ({ value, label }));

/**
 * 사용자 문의 정렬 기준
 */
export const USER_REQUEST_SORT = {
  TITLE: "title",
  STATUS: "status",
  CREATED_AT: "createdAt",
} as const;

export type UserRequestSort =
  (typeof USER_REQUEST_SORT)[keyof typeof USER_REQUEST_SORT];

export const USER_REQUEST_SORT_LABELS: Record<UserRequestSort, string> = {
  [USER_REQUEST_SORT.TITLE]: "제목순",
  [USER_REQUEST_SORT.STATUS]: "상태순",
  [USER_REQUEST_SORT.CREATED_AT]: "작성일순",
};

export const USER_REQUEST_SORT_OPTIONS = Object.entries(
  USER_REQUEST_SORT_LABELS,
).map(([value, label]) => ({ value, label }));

export const userRequestInitialFilterValue = {
  type: "all", // 전체 유형
  status: "all", // 전체 상태
};

export const USER_REQUEST_FILTER_CONFIG = {
  type: {
    label: "문의 유형",
    type: FILTER_TYPES.SELECT,
    options: [
      { label: "전체", value: "all" },
      { label: "일반 문의", value: REQUEST_TYPE.INQUIRY },
      { label: "버그 제보", value: REQUEST_TYPE.BUG_REPORT },
    ],
  },
  status: {
    label: "처리 상태",
    type: FILTER_TYPES.SELECT,
    options: [
      { label: "전체", value: "all" },
      { label: "대기 중", value: REQUEST_STATUS.PENDING },
      { label: "답변 완료", value: REQUEST_STATUS.COMPLETED },
    ],
  },
} as const;

export type UserRequestFilterKey = keyof typeof USER_REQUEST_FILTER_CONFIG;

export interface UserRequestQuery {
  page: number;
  limit: number;
  search?: string;
  searchField?: UserRequestSearchField;
  sort?: UserRequestSort;
  sortOrder?: SortOrder;
  type?: RequestType; // 문의/버그 필터링용 추가 가능
  status?: RequestStatus; // 대기/완료 상태 필터링용 추가 가능
}
