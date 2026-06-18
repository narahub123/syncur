import { SortOrder } from "@/shared/types/pagination";
import { FilterValue } from "../../constants/filters";
import {
  FEED_EXECUTION_ERROR_TYPE,
  FEED_EXECUTION_REASON,
  FEED_EXECUTION_STAGE,
  FEED_EXECUTION_STATUS,
} from "@/features/feed-execution-logs/constants/feed-execution-log";

export const ADMIN_FEED_EXECUTION_LOG_SEARCH_FIELDS = {
  SITE_NAME: "siteName",
} as const;

export type AdminFeedExecutionLogSearchField =
  (typeof ADMIN_FEED_EXECUTION_LOG_SEARCH_FIELDS)[keyof typeof ADMIN_FEED_EXECUTION_LOG_SEARCH_FIELDS];

export const ADMIN_FEED_EXECUTION_LOG_SORT_FIELDS = {
  SITE_NAME: "siteName",
  STATUS: "status",
  REASON: "reason",
  ERROR_TYPE: "errorType",
  STARTED_AT: "startedAt",
  FINISHED_AT: "finishedAt",
  DURATION_MS: "durationMs",
  FAILED_AT_STAGE: "failedAtStage",
} as const;

export type AdminFeedExecutionLogSort =
  (typeof ADMIN_FEED_EXECUTION_LOG_SORT_FIELDS)[keyof typeof ADMIN_FEED_EXECUTION_LOG_SORT_FIELDS];

export const ADMIN_FEED_EXECUTION_LOG_SEARCH_FIELD_OPTIONS: {
  value: AdminFeedExecutionLogSearchField;
  label: string;
}[] = [
  {
    value: "siteName",
    label: "사이트명",
  },
];

export const ADMIN_FEED_EXECUTION_LOG_PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10개" },
  { value: 20, label: "20개" },
  { value: 50, label: "50개" },
  { value: 100, label: "100개" },
];

export type AdminFeedExecutionLogPageSize =
  (typeof ADMIN_FEED_EXECUTION_LOG_PAGE_SIZE_OPTIONS)[number]["value"];

export const AdminFeedExecutionLogInitialFilterValue = {
  status: "all",
  reason: "all",
  errorType: "all",
  failedAtStage: "all",
  startedAt: { start: null, end: null },
  finishedAt: { start: null, end: null },
};

export const ADMIN_FEED_EXECUTION_LOG_FILTER_CONFIG = {
  status: {
    label: "상태",
    type: "select",
    options: [
      { label: "전체", value: "all" },
      ...Object.values(FEED_EXECUTION_STATUS).map((value) => ({
        label: value,
        value,
      })),
    ],
  },
  reason: {
    label: "실행 결과",
    type: "select",
    options: [
      { label: "전체", value: "all" },
      ...Object.values(FEED_EXECUTION_REASON).map((value) => ({
        label: value,
        value,
      })),
    ],
  },
  errorType: {
    label: "에러 유형",
    type: "select",
    options: [
      { label: "전체", value: "all" },
      ...Object.values(FEED_EXECUTION_ERROR_TYPE).map((value) => ({
        label: value,
        value,
      })),
    ],
  },
  failedAtStage: {
    label: "실패 단계",
    type: "select",
    options: [
      { label: "전체", value: "all" },
      ...Object.values(FEED_EXECUTION_STAGE).map((value) => ({
        label: value,
        value,
      })),
    ],
  },
  startedAt: {
    label: "시작일",
    type: "date-range",
  },
  finishedAt: {
    label: "종료일",
    type: "date-range",
  },
} as const;

export type AdminFeedExecutionLogFilterKey =
  keyof typeof ADMIN_FEED_EXECUTION_LOG_FILTER_CONFIG;

export type AdminFeedExecutionLogsQuery = {
  search: string;
  searchField: AdminFeedExecutionLogSearchField;
  sort: AdminFeedExecutionLogSort;
  sortOrder: SortOrder;
  page: number;
  limit: AdminFeedExecutionLogPageSize;
  filters: Partial<Record<AdminFeedExecutionLogFilterKey, FilterValue>>;
};
