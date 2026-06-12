/**
 * Feed Execution Status
 *
 * RSS ingestion 실행 전체 결과 상태를 정의한다.
 *
 * 사용 목적:
 * - FeedExecutionLog의 최종 결과 판단
 * - 관리자 페이지에서 성공/실패/부분 성공 필터링
 * - 운영 모니터링 및 장애 분석 기준
 *
 * 상태 정의:
 * - SUCCESS: 실행이 정상적으로 완료됨 (모든 단계 성공)
 * - FAILED: 실행 전체가 실패함 (핵심 단계에서 중단)
 * - PARTIAL_SUCCESS: 일부 item만 처리 성공 (부분 실패 포함)
 */
export const FEED_EXECUTION_STATUS = {
  RUNNING: "running",
  SUCCESS: "success",
  FAILED: "failed",
  PARTIAL_SUCCESS: "partial_success",
  SKIPPED: "skipped",
} as const;

export type FeedExecutionStatus =
  (typeof FEED_EXECUTION_STATUS)[keyof typeof FEED_EXECUTION_STATUS];

/**
 * Feed Execution Stage
 *
 * RSS ingestion 실행 과정에서 실패 또는 관측이 발생할 수 있는 단계 정의
 *
 * 사용 목적:
 * - 실패 지점 추적 (failedAtStage)
 * - 장애 원인 분석
 * - ingestion pipeline 디버깅
 *
 * 단계 정의:
 * - FETCH: RSS HTTP 요청 단계 (네트워크, timeout, HTTP error)
 * - CACHE_CHECK: ETag / Last-Modified 기반 캐시 판단 단계
 * - PARSE: RSS XML/JSON 파싱 단계
 * - PERSIST: DB 저장 단계 (FeedItem insert 과정)
 */
export const FEED_EXECUTION_STAGE = {
  FETCH: "fetch",
  CACHE_CHECK: "cache_check",
  PARSE: "parse",
  PERSIST: "persist",
} as const;

export type FeedExecutionStage =
  (typeof FEED_EXECUTION_STAGE)[keyof typeof FEED_EXECUTION_STAGE];

/**
 * 에러 타입
 *
 * HTTP_ERROR       : 네트워크 / HTTP 실패
 * XML_PARSE_ERROR  : RSS XML 파싱 실패
 * DB_ERROR         : DB 저장 실패
 * UNKNOWN          : 기타 알 수 없는 에러
 */
export const FEED_EXECUTION_ERROR_TYPE = {
  HTTP_ERROR: "HTTP_ERROR",
  XML_PARSE_ERROR: "XML_PARSE_ERROR",
  DB_ERROR: "DB_ERROR",
  UNKNOWN: "UNKNOWN",
};

export type FeedExecutionErrorType =
  (typeof FEED_EXECUTION_ERROR_TYPE)[keyof typeof FEED_EXECUTION_ERROR_TYPE];

/**
 * FeedExecutionReason
 *
 * execution이 특정 상태로 종료된 "이유"를 표현하는 값
 *
 * 특징:
 * - status(결과 상태)보다 더 구체적인 종료 원인
 * - error.type과 달리 "비에러 상황 포함" 가능
 * - 운영 로그 분석 / UI 표시 / 정책 판단에 사용
 *
 * 주의:
 * - 자유 문자열이 아니라 "제한된 enum 형태"로 관리해야 분석 가능
 * - status / error / reason은 역할이 서로 겹치지 않게 유지해야 함
 */
export const FEED_EXECUTION_REASON = {
  /**
   * feed가 disabled 상태라 ingestion이 실행되지 않음
   */
  DISABLED_FEED: "DISABLED_FEED",

  /**
   * RSS fetch 결과 304 Not Modified
   * → 데이터 변경 없음으로 ingestion skip
   */
  FETCH_NOT_MODIFIED: "FETCH_NOT_MODIFIED",

  /**
   * HTTP fetch 단계에서 에러 발생
   * (timeout / network / status error 등)
   */
  FETCH_ERROR: "FETCH_ERROR",

  /**
   * RSS XML parsing 실패
   * (invalid XML / schema mismatch 등)
   */
  PARSE_ERROR: "PARSE_ERROR",

  /**
   * DB upsert/persist 단계 실패
   * (write error / duplicate key / connection issue 등)
   */
  PERSIST_ERROR: "PERSIST_ERROR",
} as const;

/**
 * FeedExecutionReason 타입
 *
 * FEED_EXECUTION_REASON 값들의 union type
 */
export type FeedExecutionReason =
  (typeof FEED_EXECUTION_REASON)[keyof typeof FEED_EXECUTION_REASON];
