import {
  AdminFeedExecutionLogPageSize,
  AdminFeedExecutionLogSearchField,
  AdminFeedExecutionLogSort,
} from "@/features/admin/logs/types";
import { FeedExecutionErrorType } from "../constants/feed-execution-log";
import { SortOrder } from "mongoose";

/**
 * Fetch 단계 로그
 *
 * RSS HTTP 요청 결과 및 캐싱 정보
 */
export type FetchLog = {
  url: string;
  etag?: string;
  lastModified?: string;
  cacheResult?: "HIT" | "MISS";
  responseTimeMs?: number;
};

/**
 * Parse 단계 로그
 *
 * XML → normalized data 변환 결과
 */
export type ParseLog = {
  normalizedCount: number;
  errorSnippet?: string;
};

/**
 * Persist 단계 로그
 *
 * DB upsert 결과
 */
export type PersistLog = {
  upserted: number;
  matched: number;
  modified: number;
};

export type FeedExecutionError = {
  type: FeedExecutionErrorType;
  message: string;
  stack?: string;
};

export type AdminFeedExecutionLogsQuery = {
  search: string;
  searchField: AdminFeedExecutionLogSearchField;
  sort: AdminFeedExecutionLogSort;
  sortOrder: SortOrder;
  page: number;
  limit: AdminFeedExecutionLogPageSize;
};
