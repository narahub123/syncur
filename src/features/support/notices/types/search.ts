import { SortOrder } from "@/shared/types/pagination";
import { FILTER_TYPES, FilterValue } from "@/features/admin/constants/filters";
import { NOTICE_CATEGORY_OPTIONS } from "@/features/admin/notices/types/search";

/**
 * 사용자 공지사항 검색 필드
 */
export const USER_NOTICE_SEARCH_FIELD = {
  TITLE: "title",
  CONTENT: "content",
} as const;

export type UserNoticeSearchField =
  (typeof USER_NOTICE_SEARCH_FIELD)[keyof typeof USER_NOTICE_SEARCH_FIELD];

export const USER_NOTICE_SEARCH_FIELD_LABELS: Record<
  UserNoticeSearchField,
  string
> = {
  [USER_NOTICE_SEARCH_FIELD.TITLE]: "제목",
  [USER_NOTICE_SEARCH_FIELD.CONTENT]: "내용",
};

export const USER_NOTICE_SEARCH_FIELD_OPTIONS = Object.entries(
  USER_NOTICE_SEARCH_FIELD_LABELS,
).map(([value, label]) => ({ value, label }));

/**
 * 사용자 공지사항 정렬 기준
 */
export const USER_NOTICE_SORT = {
  TITLE: "title",
  VIEWS: "views",
  CREATED_AT: "createdAt",
  CATEGORY: "category",
} as const;

export type UserNoticeSort =
  (typeof USER_NOTICE_SORT)[keyof typeof USER_NOTICE_SORT];

export const USER_NOTICE_SORT_LABELS: Record<UserNoticeSort, string> = {
  [USER_NOTICE_SORT.TITLE]: "제목순",
  [USER_NOTICE_SORT.VIEWS]: "조회수순",
  [USER_NOTICE_SORT.CREATED_AT]: "작성일순",
  [USER_NOTICE_SORT.CATEGORY]: "카테고리순",
};

export const USER_NOTICE_SORT_OPTIONS = Object.entries(
  USER_NOTICE_SORT_LABELS,
).map(([value, label]) => ({ value, label }));

export interface UserNoticeQuery {
  page: number;
  limit: number;
  search: string;
  searchField: UserNoticeSearchField;
  sort?: UserNoticeSort;
  sortOrder?: SortOrder;
}

/**
 * User용 페이지 사이즈 상수
 */
export const USER_PAGE_SIZE = {
  TEN: 10,
  TWENTY: 20,
  FIFTY: 50,
} as const;

export type UserPageSize = (typeof USER_PAGE_SIZE)[keyof typeof USER_PAGE_SIZE];

export const USER_PAGE_SIZE_OPTIONS = [
  { value: USER_PAGE_SIZE.TEN, label: "10개씩 보기" },
  { value: USER_PAGE_SIZE.TWENTY, label: "20개씩 보기" },
  { value: USER_PAGE_SIZE.FIFTY, label: "50개씩 보기" },
];

export const userNoticeInitialFilterValue = {
  category: ["all"],
};

export const USER_NOTICE_FILTER_CONFIG = {
  category: {
    label: "카테고리",
    type: FILTER_TYPES.SELECT, // 사용자는 보통 하나씩 확인하므로 Select 선호
    options: [{ label: "전체", value: "all" }, ...NOTICE_CATEGORY_OPTIONS],
  },
} as const;

export type UserNoticeFilterKey = keyof typeof USER_NOTICE_FILTER_CONFIG;

export interface UserNoticesQuery {
  page: number;
  limit: UserPageSize;
  search: string;
  searchField: UserNoticeSearchField;
  sort: UserNoticeSort;
  sortOrder: SortOrder;
  filters: Partial<Record<UserNoticeFilterKey, FilterValue>>;
}
