import { SortOrder } from "@/shared/types/pagination";
import { FILTER_TYPES, FilterValue } from "@/features/admin/constants/filters";
import {
  REQUEST_STATUS,
  REQUEST_STATUS_LABELS,
  REQUEST_TYPE,
  REQUEST_TYPE_LABELS,
} from "../constants/request-type";

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
).map(([value, label]) => ({
  value,
  label,
}));

/**
 * 사용자 문의 정렬 기준
 */
export const USER_REQUEST_SORT = {
  TITLE: "title",
  STATUS: "status",
  CREATED_AT: "createdAt",
  TYPE: "type",
} as const;

export type UserRequestSort =
  (typeof USER_REQUEST_SORT)[keyof typeof USER_REQUEST_SORT];

export const USER_REQUEST_SORT_LABELS: Record<UserRequestSort, string> = {
  [USER_REQUEST_SORT.TITLE]: "제목순",
  [USER_REQUEST_SORT.STATUS]: "상태순",
  [USER_REQUEST_SORT.CREATED_AT]: "작성일순",
  [USER_REQUEST_SORT.TYPE]: "유형순",
};

export const USER_REQUEST_SORT_OPTIONS = Object.entries(
  USER_REQUEST_SORT_LABELS,
).map(([value, label]) => ({
  value,
  label,
}));

/**
 * User 페이지 크기
 */
export const USER_PAGE_SIZE = {
  DEFAULT: 10,
  TWENTY: 20,
  FIFTY: 50,
} as const;

export type UserPageSize = (typeof USER_PAGE_SIZE)[keyof typeof USER_PAGE_SIZE];

export const USER_PAGE_SIZE_OPTIONS = [
  {
    value: USER_PAGE_SIZE.DEFAULT,
    label: "10개씩 보기",
  },
  {
    value: USER_PAGE_SIZE.TWENTY,
    label: "20개씩 보기",
  },
  {
    value: USER_PAGE_SIZE.FIFTY,
    label: "50개씩 보기",
  },
];

/**
 * 필터 초기값
 */
export const userRequestInitialFilterValue = {
  type: "all",
  status: ["all"],
};

/**
 * 사용자 문의 필터
 */
export const USER_REQUEST_FILTER_CONFIG = {
  type: {
    label: "문의 유형",
    type: FILTER_TYPES.SELECT,
    options: [
      {
        label: "전체",
        value: "all" as const,
      },
      ...Object.values(REQUEST_TYPE).map((value) => ({
        value,
        label: REQUEST_TYPE_LABELS[value],
      })),
    ],
  },

  status: {
    label: "처리 상태",
    type: FILTER_TYPES.MULTI_SELECT,
    options: [
      {
        label: "전체",
        value: "all" as const,
      },
      ...Object.values(REQUEST_STATUS).map((value) => ({
        value,
        label: REQUEST_STATUS_LABELS[value],
      })),
    ],
  },
} as const;

export type UserRequestFilterKey = keyof typeof USER_REQUEST_FILTER_CONFIG;

/**
 * 사용자 문의 목록 조회 Query
 */
export interface UserRequestQuery {
  page: number;
  limit: UserPageSize;
  search: string;
  searchField: UserRequestSearchField;
  sort: UserRequestSort;
  sortOrder: SortOrder;
  filters: Partial<Record<UserRequestFilterKey, FilterValue>>;
}
