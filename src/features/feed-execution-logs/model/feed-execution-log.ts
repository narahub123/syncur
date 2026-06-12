import mongoose, { Schema, Types, Document } from "mongoose";
import {
  FEED_EXECUTION_ERROR_TYPE,
  FEED_EXECUTION_REASON,
  FEED_EXECUTION_STAGE,
  FEED_EXECUTION_STATUS,
  FeedExecutionReason,
  FeedExecutionStage,
  FeedExecutionStatus,
} from "../constants/feed-execution-log";
import { FeedExecutionError, FetchLog, ParseLog, PersistLog } from "../types";

/**
 * FeedExecutionLogDocument
 *
 * 하나의 RSS ingestion 실행 단위를 기록하는 로그
 */
export interface FeedExecutionLogDocument extends Document {
  /** 대상 Feed ID */
  feedId: Types.ObjectId;

  /**
   * 실행 단위 식별자
   */
  executionId: string;

  /**
   * 실행 상태
   */
  status: FeedExecutionStatus;

  reason: FeedExecutionReason;

  /** execution 시작 시각 */
  startedAt: Date;

  /** execution 종료 시각 */
  finishedAt?: Date;

  /** 전체 실행 소요 시간 (ms) */
  durationMs?: number;

  /** HTTP 상태 코드 */
  httpStatus?: number;

  /** 캐시 히트 여부 */
  cacheHit?: boolean;

  /** RSS fetch 결과 */
  fetch?: FetchLog;

  /** parse 결과 */
  parse?: ParseLog;

  /** DB persist 결과 */
  persist?: PersistLog;

  /** RSS에서 읽어온 item 수 */
  fetchedCount?: number;

  /** DB 저장 item 수 */
  insertedCount?: number;

  /**
   * 실행 에러 정보
   *
   * ingestion 과정에서 발생한 오류 상세 정보
   *
   * 목적:
   * - 장애 원인 추적
   * - 단계별 실패 분석
   * - stack 기반 디버깅
   */
  error?: FeedExecutionError;

  /** 실패 발생 단계 */
  failedAtStage?: FeedExecutionStage;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * FeedExecutionLog Schema
 */
const FeedExecutionLogSchema = new Schema<FeedExecutionLogDocument>(
  {
    feedId: {
      type: Schema.Types.ObjectId,
      ref: "Feed",
      required: true,
      index: true,
    },

    executionId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(FEED_EXECUTION_STATUS),
      required: true,
      index: true,
    },

    reason: {
      type: String,
      enum: Object.values(FEED_EXECUTION_REASON),
      default: undefined,
    },

    startedAt: {
      type: Date,
      required: true,
    },

    finishedAt: {
      type: Date,
      default: null,
    },

    durationMs: {
      type: Number,
      default: null,
    },

    httpStatus: {
      type: Number,
      default: null,
    },

    cacheHit: {
      type: Boolean,
      default: false,
    },

    /**
     * Fetch 로그
     */
    fetch: {
      type: Object,
      default: null,
    },

    /**
     * Parse 로그
     */
    parse: {
      type: Object,
      default: null,
    },

    /**
     * Persist 로그
     */
    persist: {
      type: Object,
      default: null,
    },

    fetchedCount: {
      type: Number,
      default: 0,
    },

    insertedCount: {
      type: Number,
      default: 0,
    },

    error: {
      type: {
        type: String,
        enum: Object.values(FEED_EXECUTION_ERROR_TYPE),
        default: null,
      },

      /**
       * 에러 메시지
       */
      message: {
        type: String,
        default: null,
      },

      /**
       * 에러 스택 트레이스
       *
       * 개발 / 디버깅 용도
       */
      stack: {
        type: String,
        default: null,
      },
    },

    failedAtStage: {
      type: String,
      enum: Object.values(FEED_EXECUTION_STAGE),
      default: null,
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
FeedExecutionLogSchema.index({ executionId: 1 }, { unique: true });
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
