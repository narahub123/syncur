import { SortOrder } from "@/shared/types/pagination";
import { FILTER_TYPES, FilterValue } from "../../constants/filters";
import { FEED_STATUS } from "@/features/feeds/constants/feed-status";

export const ADMIN_FEED_SEARCH_FIELDS = {
  SITE_NAME: "siteName",
  SITE_URL: "siteUrl",
  STATUS: "status",
  CATEGORY: "category",
} as const;

export type AdminFeedSearchField =
  (typeof ADMIN_FEED_SEARCH_FIELDS)[keyof typeof ADMIN_FEED_SEARCH_FIELDS];

export const ADMIN_FEED_SORT_FIELDS = {
  SITE_NAME: "siteName",
  FEED_URL: "feedUrl",
  SUBSCRIBER_COUNT: "subscriberCount",
  STATUS: "status",
  ERROR_COUNT: "errorCount",
  LAST_FETCHED_AT: "lastFetchedAt",
  CREATED_AT: "createdAt",
} as const;

export type AdminFeedSort =
  (typeof ADMIN_FEED_SORT_FIELDS)[keyof typeof ADMIN_FEED_SORT_FIELDS];

export const ADMIN_FEED_SEARCH_FIELD_OPTIONS: {
  value: AdminFeedSearchField;
  label: string;
}[] = [
  {
    value: "siteName",
    label: "사이트명",
  },
  {
    value: "siteUrl",
    label: "사이트 URL",
  },
  {
    value: "status",
    label: "상태",
  },
  {
    value: "category",
    label: "카테고리",
  },
];

export const ADMIN_FEED_PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10개" },
  { value: 20, label: "20개" },
  { value: 50, label: "50개" },
  { value: 100, label: "100개" },
];

export type AdminFeedPageSize =
  (typeof ADMIN_FEED_PAGE_SIZE_OPTIONS)[number]["value"];

export const AdminFeedInitialFilterValue = {
  status: "all",
  errorCount: ["all"],
  createdAt: { start: null, end: null },
  lastFetchedAt: { start: null, end: null },
  subscriberCouter: { min: null, max: null },
};

export const ADMIN_FEED_FILTER_CONFIG = {
  status: {
    label: "상태",
    type: FILTER_TYPES.SELECT,
    options: [
      { label: "전체", value: "all" },
      { label: "활성", value: FEED_STATUS.ACTIVE },
      { label: "비활성", value: FEED_STATUS.DISABLED },
    ],
  },
  errorCount: {
    label: "에러 횟수",
    type: FILTER_TYPES.MULTI_SELECT,
    options: [
      { label: "전체", value: "all" },
      { label: "0회", value: "0" },
      { label: "1회", value: "1" },
      { label: "2회", value: "2" },
      { label: "3회", value: "3" },
      { label: "4회", value: "4" },
      { label: "5회", value: "5" },
    ],
  },
  createdAt: { label: "생성일", type: FILTER_TYPES.DATE_RANGE },
  lastFetchedAt: {
    label: "마지막 수집일",
    type: FILTER_TYPES.DATE_RANGE,
  },
  subscriberCount: {
    label: "구독자 수",
    type: FILTER_TYPES.NUMBER_RANGE,
    min: 0,
  },
} as const;

export type AdminFeedFilterKey = keyof typeof ADMIN_FEED_FILTER_CONFIG;

export type AdminFeedsQuery = {
  search: string;
  searchField: AdminFeedSearchField;
  sort: AdminFeedSort;
  sortOrder: SortOrder;
  page: number;
  limit: AdminFeedPageSize;
  filters: Partial<Record<AdminFeedFilterKey, FilterValue>>;
};
