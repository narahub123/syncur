import {
  FeedExecutionReason,
  FeedExecutionStage,
  FeedExecutionStatus,
} from "@/features/feed-execution-logs/constants/feed-execution-log";
import {
  FeedExecutionError,
  FetchLog,
  ParseLog,
  PersistLog,
} from "@/features/feed-execution-logs/types";
import { FeedExecutionLogWithFeedAndSiteLean } from "../types/lean";
import { PaginatedResponse } from "@/shared/types/pagination";

export type FeedExecutionLogDto = {
  _id: string;

  feedId: string;
  executionId: string;

  status: FeedExecutionStatus;
  reason: FeedExecutionReason;

  startedAt: string;
  finishedAt?: string | null;
  durationMs?: number | null;

  httpStatus?: number | null;
  cacheHit?: boolean;

  fetch?: FetchLog | null;
  parse?: ParseLog | null;
  persist?: PersistLog | null;

  fetchedCount?: number;
  insertedCount?: number;

  error?: FeedExecutionError | null;
  failedAtStage?: FeedExecutionStage | null;

  createdAt: string;
  updatedAt: string;
};

export type FeedExecutionLogWithFeedAndSiteDto = {
  _id: string;

  executionId: string;

  status: FeedExecutionStatus;
  reason: FeedExecutionReason;

  startedAt: string;
  finishedAt: string | null;
  durationMs: number | null;

  httpStatus: number | null;
  cacheHit: boolean;

  fetchedCount: number;
  insertedCount: number;

  error: {
    type: string | null;
    message: string | null;
    stack: string | null;
  } | null;

  failedAtStage: FeedExecutionStage | null;

  createdAt: string;
  updatedAt: string;

  /**
   * Feed 정보 (UI 표시용)
   */
  feed: {
    _id: string;
    feedUrl: string;
    status: string;
  } | null;

  /**
   * Site 정보 (UI 핵심 표시)
   */
  site: {
    _id: string;
    url: string;
    name: string;
    faviconUrl: string | null;
  } | null;
};

export type FeedExecutionLogWithFeedAndSiteLeanPagedResponse = {
  items: FeedExecutionLogWithFeedAndSiteLean[];
  totalCount: number;
};

export type FeedExecutionLogWithFeedAndSiteDtoPagedResponse =
  PaginatedResponse<FeedExecutionLogWithFeedAndSiteDto>;
