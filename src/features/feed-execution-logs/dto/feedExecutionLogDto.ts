import {
  FeedExecutionError,
  FetchLog,
  ParseLog,
  PersistLog,
} from "@/features/feed-execution-logs/types";
import { FeedExecutionLogWithFeedAndSiteLean } from "../types/lean";
import { PaginatedResponse } from "@/shared/types/pagination";
import {
  FeedExecutionReason,
  FeedExecutionStage,
  FeedExecutionStatus,
} from "@/features/admin/logs/types/search";
import { FeedFetchObservationDTO } from "@/features/feed-fetch-observation/dtos/feedFetchObservationDTO";

export type FeedExecutionLogDto = {
  _id: string;

  /**
   * Feed / Execution 식별자
   */
  feedId: string;
  executionId: string;

  /**
   * 실행 상태
   */
  status: FeedExecutionStatus;
  reason?: FeedExecutionReason | null;

  /**
   * 실행 시간
   */
  startedAt: string;
  finishedAt?: string | null;
  durationMs?: number | null;

  /**
   * 실패 stage
   */
  failedAtStage?: FeedExecutionStage | null;

  /**
   * Fetch 단계 로그
   */
  fetch?: FetchLog | null;

  /**
   * Parse 단계 로그
   */
  parse?: ParseLog | null;

  /**
   * Persist 단계 로그
   */
  persist?: PersistLog | null;

  /**
   * 에러 정보
   */
  error?: FeedExecutionError | null;

  createdAt: string;
  updatedAt: string;
};

export type FeedExecutionLogWithFeedAndSiteDto = {
  _id: string;

  /**
   * 실행 식별자
   */
  executionId: string;

  /**
   * 실행 상태
   */
  status: FeedExecutionStatus;
  reason?: FeedExecutionReason | null;

  /**
   * 실행 시간
   */
  startedAt: string;
  finishedAt: string | null;
  durationMs: number | null;

  /**
   * 실패 stage
   */
  failedAtStage: FeedExecutionStage | null;

  /**
   * Fetch / Parse / Persist stage 로그
   */
  fetch?: FetchLog | null;
  parse?: ParseLog | null;
  persist?: PersistLog | null;

  /**
   * 에러 정보
   */
  error: {
    type: string | null;
    message: string | null;
    stack: string | null;
  } | null;

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

export type FeedExecutionLogWithFeedAndSiteDtoAndObservations =
  FeedExecutionLogWithFeedAndSiteDto & {
    observations: FeedFetchObservationDTO[];
  };

export type FeedExecutionLogWithFeedAndSiteLeanPagedResponse = {
  items: FeedExecutionLogWithFeedAndSiteLean[];
  totalCount: number;
};

export type FeedExecutionLogWithFeedAndSiteDtoPagedResponse =
  PaginatedResponse<FeedExecutionLogWithFeedAndSiteDto>;
