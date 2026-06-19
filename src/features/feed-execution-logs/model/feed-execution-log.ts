import {
  FEED_EXECUTION_ERROR_TYPE,
  FEED_EXECUTION_REASON,
  FEED_EXECUTION_STAGE,
  FEED_EXECUTION_STATUS,
  FeedExecutionReason,
  FeedExecutionStage,
  FeedExecutionStatus,
} from "@/features/admin/logs/types/search";
import mongoose, { Schema, Types, Document } from "mongoose";

/**
 * FeedExecutionError
 *
 * 실행 중 발생한 에러 정보
 *
 * 목적:
 * - 장애 원인 추적
 * - stage 기반 실패 분석
 * - 디버깅 및 운영 알림 연동
 */
export interface FeedExecutionError {
  type: keyof typeof FEED_EXECUTION_ERROR_TYPE;
  message: string;
  stack?: string;
}

/**
 * Fetch 단계 로그
 *
 * RSS fetch 과정의 모든 결과를 포함
 */
export interface FetchLog {
  url: string;

  /**
   * HTTP 캐시 검증 값
   * - ETag / Last-Modified 기반
   */
  etag?: string;
  lastModified?: string;

  /**
   * 캐시 히트 여부
   * - true: 변경 없음 (NOT_MODIFIED)
   * - false: 신규 fetch
   */
  cache: {
    hit: boolean;
  };

  /**
   * HTTP 상태 코드 (옵션)
   */
  statusCode?: number;

  /**
   * 응답 크기 (옵션)
   */
  size?: number;
}

/**
 * Parse 단계 로그
 *
 * XML → normalized data 변환 결과
 */
export interface ParseLog {
  /**
   * 정상 파싱된 item 개수
   */
  normalizedCount: number;

  /**
   * 파싱 실패 / 무시된 item 개수
   */
  invalidCount?: number;
}

/**
 * Persist 단계 로그
 *
 * DB upsert 결과
 */
export interface PersistLog {
  /**
   * 신규 insert 개수
   */
  upserted: number;

  /**
   * 기존 매칭 개수
   */
  matched: number;

  /**
   * 업데이트된 개수
   */
  modified: number;

  /**
   * 실패 개수 (옵션)
   */
  failed?: number;
}

/**
 * FeedExecutionLog Document
 *
 * RSS ingestion 실행 단위 로그
 */
export interface FeedExecutionLogDocument extends Document {
  /** 대상 Feed ID */
  feedId: Types.ObjectId;

  /**
   * 실행 식별자 (unique)
   * - 하나의 ingestion run 단위
   */
  executionId: string;

  /**
   * 실행 상태
   */
  status: FeedExecutionStatus;

  /**
   * 실행 종료 이유 / 상태 사유
   */
  reason?: FeedExecutionReason;

  /**
   * 실행 시작 시각
   */
  startedAt: Date;

  /**
   * 실행 종료 시각
   */
  finishedAt?: Date;

  /**
   * 전체 실행 시간 (ms)
   * - finishedAt - startedAt
   */
  durationMs?: number;

  /**
   * 실패 발생 stage
   */
  failedAtStage?: FeedExecutionStage;

  /**
   * Fetch 단계 로그
   */
  fetch?: FetchLog;

  /**
   * Parse 단계 로그
   */
  parse?: ParseLog;

  /**
   * Persist 단계 로그
   */
  persist?: PersistLog;

  /**
   * 에러 정보
   */
  error?: FeedExecutionError;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * FeedExecutionLog Schema
 */
const FeedExecutionLogSchema = new Schema<FeedExecutionLogDocument>(
  {
    /**
     * Feed ID (source)
     */
    feedId: {
      type: Schema.Types.ObjectId,
      ref: "Feed",
      required: true,
      index: true,
    },

    /**
     * 실행 ID (unique per run)
     */
    executionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    /**
     * 실행 상태
     */
    status: {
      type: String,
      enum: Object.values(FEED_EXECUTION_STATUS),
      required: true,
      index: true,
    },

    /**
     * 종료 사유 / 결과 코드
     */
    reason: {
      type: String,
      enum: Object.values(FEED_EXECUTION_REASON),
      default: null,
    },

    /**
     * 실행 시작 시간
     */
    startedAt: {
      type: Date,
      required: true,
      index: true,
    },

    /**
     * 실행 종료 시간
     */
    finishedAt: {
      type: Date,
      default: null,
    },

    /**
     * 전체 실행 시간 (ms)
     */
    durationMs: {
      type: Number,
      default: null,
    },

    /**
     * 실패 발생 stage
     */
    failedAtStage: {
      type: String,
      enum: Object.values(FEED_EXECUTION_STAGE),
      default: null,
    },

    /**
     * Fetch 단계 로그
     */
    fetch: {
      type: Object,
      default: null,
    },

    /**
     * Parse 단계 로그
     */
    parse: {
      type: Object,
      default: null,
    },

    /**
     * Persist 단계 로그
     */
    persist: {
      type: Object,
      default: null,
    },

    /**
     * 에러 정보
     */
    error: {
      type: {
        type: String,
        enum: Object.values(FEED_EXECUTION_ERROR_TYPE),
        default: null,
      },
      message: {
        type: String,
        default: null,
      },
      stack: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Index 전략
 */
FeedExecutionLogSchema.index({ feedId: 1, startedAt: -1 });
FeedExecutionLogSchema.index({ status: 1, startedAt: -1 });

/**
 * Model export
 */
export const FeedExecutionLogModel =
  mongoose.models.FeedExecutionLog ||
  mongoose.model<FeedExecutionLogDocument>(
    "FeedExecutionLog",
    FeedExecutionLogSchema,
  );
