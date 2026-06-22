import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * FeedFetchObservationDocument
 *
 * === 역할 ===
 * RSS fetch 과정에서 발생하는 "attempt 단위 관측 데이터"
 *
 * 기존 FeedExecutionLog가 "결과 요약"이라면,
 * 이 모델은 "실행 과정(raw telemetry)"을 담당한다.
 *
 * === 사용 목적 ===
 * - retry 패턴 분석
 * - latency 분석
 * - timeout / DNS / HTTP 에러 분리
 * - feed별 안정성 측정
 * - 장애 재현 데이터 확보
 */
export interface FeedFetchObservationDocument extends Document {
  /**
   * 실행 단위 ID
   * - FeedExecutionLog.executionId와 동일하게 사용
   * - 하나의 ingestion run에 대한 correlation key
   */
  executionId: string;

  /**
   * Feed 식별자
   */
  feedId: Types.ObjectId;

  /**
   * 요청 대상 URL
   */
  feedUrl: string;

  /**
   * retry attempt index
   * - 0부터 시작
   */
  attempt: number;

  /**
   * 요청 시작 시각
   */
  startTime: Date;

  /**
   * 요청 종료 시각
   */
  endTime: Date;

  /**
   * 전체 소요 시간 (ms)
   */
  durationMs: number;

  /**
   * 성공 여부
   */
  success: boolean;

  /**
   * 실패 코드 (네트워크/axios 기준)
   * 예:
   * - ETIMEDOUT
   * - ECONNRESET
   * - ERR_CANCELED
   */
  errorCode?: string;

  /**
   * 에러 메시지
   */
  errorMessage?: string;

  createdAt: Date;
  updatedAt: Date;
}

const FeedFetchObservationSchema = new Schema<FeedFetchObservationDocument>(
  {
    /**
     * Execution correlation key
     */
    executionId: {
      type: String,
      required: true,
      index: true,
    },

    /**
     * Feed reference
     */
    feedId: {
      type: Schema.Types.ObjectId,
      ref: "Feed",
      required: true,
      index: true,
    },

    /**
     * RSS endpoint URL
     */
    feedUrl: {
      type: String,
      required: true,
    },

    /**
     * retry attempt index
     */
    attempt: {
      type: Number,
      required: true,
    },

    /**
     * request start time
     */
    startTime: {
      type: Date,
      required: true,
    },

    /**
     * request end time
     */
    endTime: {
      type: Date,
      required: true,
    },

    /**
     * duration (ms)
     */
    durationMs: {
      type: Number,
      required: true,
    },

    /**
     * success flag
     */
    success: {
      type: Boolean,
      required: true,
    },

    /**
     * error code (axios/network level)
     */
    errorCode: {
      type: String,
      default: null,
    },

    /**
     * error message
     */
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Index design
 *
 * === 분석 최적화 기준 ===
 * 1. execution 단위 분석 (run 전체 흐름)
 * 2. feed 단위 안정성 분석
 * 3. 성공/실패 패턴 분석
 */
FeedFetchObservationSchema.index({
  executionId: 1,
  attempt: 1,
});

FeedFetchObservationSchema.index({
  feedId: 1,
  createdAt: -1,
});

FeedFetchObservationSchema.index({
  success: 1,
  createdAt: -1,
});

export const FeedFetchObservationModel =
  mongoose.models.FeedFetchObservation ||
  mongoose.model<FeedFetchObservationDocument>(
    "FeedFetchObservation",
    FeedFetchObservationSchema,
  );
