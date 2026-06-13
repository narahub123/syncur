import { Types } from "mongoose";
import { FeedExecutionError, FetchLog, ParseLog, PersistLog } from ".";
import {
  FeedExecutionReason,
  FeedExecutionStage,
  FeedExecutionStatus,
} from "../constants/feed-execution-log";

/**
 * FeedExecutionLog Lean Type
 *
 * RSS ingestion 실행 로그 (조회용 DTO)
 * - stage 기반 구조(fetch/parse/persist) 중심
 * - legacy flat metrics 제거된 최종 버전
 */
export type FeedExecutionLogLean = {
  _id: Types.ObjectId;

  /** 대상 Feed ID */
  feedId: Types.ObjectId;

  /**
   * 실행 식별자 (unique per ingestion run)
   */
  executionId: string;

  /**
   * 실행 상태
   */
  status: FeedExecutionStatus;

  /**
   * 실행 종료 사유
   */
  reason?: FeedExecutionReason | null;

  /**
   * 실행 시작 시각
   */
  startedAt: Date;

  /**
   * 실행 종료 시각
   */
  finishedAt?: Date | null;

  /**
   * 전체 실행 시간 (ms)
   * finishedAt - startedAt
   */
  durationMs?: number | null;

  /**
   * 실패 발생 stage
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

  createdAt: Date;
  updatedAt: Date;
};

/**
 * FeedExecutionLog + Feed + Site JOIN Lean Type
 *
 * 목적:
 * - Admin / monitoring UI용 DTO
 * - ingestion 로그 + feed + site 정보 결합
 * - stage 기반 구조(fetch/parse/persist) 기준
 */
export type FeedExecutionLogWithFeedAndSiteLean = {
  _id: Types.ObjectId;

  /**
   * 실행 식별자
   */
  executionId: string;

  /**
   * 실행 상태
   */
  status: FeedExecutionStatus;

  /**
   * 종료 사유
   */
  reason?: FeedExecutionReason | null;

  /**
   * 실행 시작 시간
   */
  startedAt: Date;

  /**
   * 실행 종료 시간
   */
  finishedAt?: Date | null;

  /**
   * 전체 실행 시간 (ms)
   */
  durationMs?: number | null;

  /**
   * 실패 발생 stage
   */
  failedAtStage?: FeedExecutionStage | null;

  /**
   * Fetch / Parse / Persist 구조 로그 (핵심 변경)
   */
  fetch?: FetchLog | null;

  parse?: ParseLog | null;

  persist?: PersistLog | null;

  /**
   * 에러 정보
   */
  error?: FeedExecutionError | null;

  createdAt: Date;
  updatedAt: Date;

  /**
   * JOIN 결과 - Feed
   */
  feed?: {
    _id: Types.ObjectId;
    feedUrl: string;
    status: FeedExecutionStatus;
    siteId: Types.ObjectId;
  } | null;

  /**
   * JOIN 결과 - Site
   */
  site?: {
    _id: Types.ObjectId;
    url: string;
    name: string;
    favicon_url: string | null;
  } | null;
};
