import { SortOrder } from "@/shared/types/pagination";

export type AdminFeedExecutionLogSearchField = "siteName";

export type AdminFeedExecutionLogSort =
  | "siteName"
  | "errorType"
  | "status"
  | "reason"
  | "httpStatus"
  | "startedAt"
  | "durationMs"
  | "cacheHit"
  | "fetchedCount"
  | "insertedCount"
  | "failedAtStage";

export type AdminFeedExecutionLogPageSize = 10 | 20 | 50 | 100;

export type AdminFeedExecutionLogsQuery = {
  search: string;
  searchField: AdminFeedExecutionLogSearchField;
  sort: AdminFeedExecutionLogSort;
  sortOrder: SortOrder;
  page: number;
  limit: AdminFeedExecutionLogPageSize;
};
