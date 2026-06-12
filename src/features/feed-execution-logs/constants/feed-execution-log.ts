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
