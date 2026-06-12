import mongoose, { Schema, Types, Document } from "mongoose";
import {
  FEED_EXECUTION_STAGE,
  FEED_EXECUTION_STATUS,
  FeedExecutionStage,
  FeedExecutionStatus,
} from "../constants/feed-execution-log";

/**
 * FeedExecutionLogDocument
 *
 * 하나의 RSS(Feed) ingestion 실행 단위를 기록하는 로그
 *
 * 핵심 개념:
 * - cron 1회 실행 = 1 execution
 * - execution 내부에서 발생한 모든 결과를 요약 저장
 *
 * 목적:
 * - RSS ingestion 상태 추적
 * - 실패 원인 분석
 * - 성능(latency) 분석
 * - 데이터 적재 결과 추적
 */
export interface FeedExecutionLogDocument extends Document {
  /** 대상 Feed ID */
  feedId: Types.ObjectId;

  /**
   * 실행 단위 식별자
   *
   * - cron 1회 실행을 구분하는 unique id
   * - 하나의 execution 범위를 묶는 key
   */
  executionId: string;

  /**
   * 실행 상태
   *
   * success        : 정상 완료
   * failed         : 전체 실패
   * partial_success: 일부 성공 (예: 일부 item만 저장 성공)
   */
  status: FeedExecutionStatus;

  /** execution 시작 시각 */
  startedAt: Date;

  /** execution 종료 시각 */
  finishedAt?: Date;

  /** 전체 실행 소요 시간 (ms) */
  durationMs?: number;

  /**
   * HTTP 응답 상태 코드
   *
   * RSS fetch 요청 결과 (200, 304, 404 등)
   */
  httpStatus?: number;

  /**
   * 캐시 히트 여부
   *
   * true:
   * - etag / lastModified로 인해 fetch skip
   *
   * false:
   * - 실제 RSS fetch 수행
   */
  cacheHit?: boolean;

  /**
   * RSS에서 읽어온 item 수
   */
  fetchedCount?: number;

  /**
   * DB에 실제 저장된 item 수
   */
  insertedCount?: number;

  /**
   * 실패 메시지
   *
   * - 에러 발생 시 원인 텍스트
   */
  errorMessage?: string;

  /**
   * 에러 코드
   *
   * 예:
   * - NETWORK_ERROR
   * - PARSE_ERROR
   * - TIMEOUT
   */
  errorCode?: string;

  /**
   * 실패 발생 단계
   *
   * fetch        : HTTP 요청 실패
   * cache_check  : 캐시 판단 단계 실패
   * parse        : XML parsing 실패
   * persist      : DB 저장 실패
   */
  failedAtStage?: FeedExecutionStage;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * FeedExecutionLog Schema
 *
 * 운영 목적:
 * - ingestion 실행 단위 추적
 * - 장애 분석
 * - 성능 분석
 */
const FeedExecutionLogSchema = new Schema<FeedExecutionLogDocument>(
  {
    /** 대상 Feed */
    feedId: {
      type: Schema.Types.ObjectId,
      ref: "Feed",
      required: true,
      index: true,
    },

    /** execution 단위 ID */
    executionId: {
      type: String,
      required: true,
    },

    /** 실행 상태 */
    status: {
      type: String,
      enum: Object.values(FEED_EXECUTION_STATUS),
      required: true,
      index: true,
    },

    /** 실행 시작 시각 */
    startedAt: {
      type: Date,
      required: true,
    },

    /** 실행 종료 시각 */
    finishedAt: {
      type: Date,
      default: null,
    },

    /** 실행 소요 시간 */
    durationMs: {
      type: Number,
      default: null,
    },

    /** HTTP 상태 코드 */
    httpStatus: {
      type: Number,
      default: null,
    },

    /** 캐시 히트 여부 */
    cacheHit: {
      type: Boolean,
      default: false,
    },

    /** fetch된 RSS item 수 */
    fetchedCount: {
      type: Number,
      default: 0,
    },

    /** DB 저장 성공 item 수 */
    insertedCount: {
      type: Number,
      default: 0,
    },

    /** 에러 메시지 */
    errorMessage: {
      type: String,
      default: null,
    },

    /** 에러 코드 */
    errorCode: {
      type: String,
      default: null,
    },

    /** 실패 발생 단계 */
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
 *
 * - feedId + 시간 기준 조회 (관리자 페이지 핵심)
 * - executionId 단일 조회 (trace)
 * - status 기반 분석
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
