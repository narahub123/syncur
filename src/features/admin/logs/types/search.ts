import { SortOrder } from "@/shared/types/pagination";
import { FilterValue } from "../../constants/filters";

export const ADMIN_FEED_EXECUTION_LOG_SEARCH_FIELDS = {
  SITE_NAME: "siteName",
} as const;

export type AdminFeedExecutionLogSearchField =
  (typeof ADMIN_FEED_EXECUTION_LOG_SEARCH_FIELDS)[keyof typeof ADMIN_FEED_EXECUTION_LOG_SEARCH_FIELDS];

export const ADMIN_FEED_EXECUTION_LOG_SORT_FIELDS = {
  SITE_NAME: "siteName",
  STATUS: "status",
  REASON: "reason",
  ERROR_TYPE: "errorType",
  STARTED_AT: "startedAt",
  FINISHED_AT: "finishedAt",
  DURATION_MS: "durationMs",
  FAILED_AT_STAGE: "failedAtStage",
} as const;

export type AdminFeedExecutionLogSort =
  (typeof ADMIN_FEED_EXECUTION_LOG_SORT_FIELDS)[keyof typeof ADMIN_FEED_EXECUTION_LOG_SORT_FIELDS];

export const ADMIN_FEED_EXECUTION_LOG_SEARCH_FIELD_OPTIONS: {
  value: AdminFeedExecutionLogSearchField;
  label: string;
}[] = [
  {
    value: "siteName",
    label: "사이트명",
  },
];

export const ADMIN_FEED_EXECUTION_LOG_PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10개" },
  { value: 20, label: "20개" },
  { value: 50, label: "50개" },
  { value: 100, label: "100개" },
];

export type AdminFeedExecutionLogPageSize =
  (typeof ADMIN_FEED_EXECUTION_LOG_PAGE_SIZE_OPTIONS)[number]["value"];

export const AdminFeedExecutionLogInitialFilterValue = {
  status: ["all"],
  reason: ["all"],
  errorType: ["all"],
  failedAtStage: ["all"],
  startedAt: { start: null, end: null },
  finishedAt: { start: null, end: null },
};

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

export const FEED_EXECUTION_STATUS_KR: Record<FeedExecutionStatus, string> = {
  running: "진행중",
  success: "성공",
  failed: "실패",
  partial_success: "부분 성공",
  skipped: "스킵",
};

export const FEED_EXECUTION_STAGE_KR: Record<FeedExecutionStage, string> = {
  fetch: "수집",
  cache_check: "캐시 확인",
  parse: "파싱",
  persist: "저장",
};

export const FEED_EXECUTION_ERROR_TYPE_KR: Record<
  FeedExecutionErrorType,
  string
> = {
  HTTP_ERROR: "HTTP 오류",
  XML_PARSE_ERROR: "XML 파싱 오류",
  DB_ERROR: "DB 오류",
  UNKNOWN: "알 수 없는 오류",
};

export const FEED_EXECUTION_REASON_KR: Record<FeedExecutionReason, string> = {
  DISABLED_FEED: "비활성 피드",
  FETCH_NOT_MODIFIED: "변경 없음 (304)",
  FETCH_ERROR: "수집 실패",
  PARSE_ERROR: "파싱 실패",
  PERSIST_ERROR: "저장 실패",
};

export const ADMIN_FEED_EXECUTION_LOG_FILTER_CONFIG = {
  status: {
    label: "상태",
    type: "multi-select",
    options: [
      { label: "전체", value: "all" },
      ...Object.values(FEED_EXECUTION_STATUS).map((value) => ({
        label: FEED_EXECUTION_STATUS_KR[value],
        value,
      })),
    ],
  },
  reason: {
    label: "실행 결과",
    type: "multi-select",
    options: [
      { label: "전체", value: "all" },
      ...Object.values(FEED_EXECUTION_REASON).map((value) => ({
        label: FEED_EXECUTION_REASON_KR[value],
        value,
      })),
    ],
  },
  errorType: {
    label: "에러 유형",
    type: "multi-select",
    options: [
      { label: "전체", value: "all" },
      ...Object.values(FEED_EXECUTION_ERROR_TYPE).map((value) => ({
        label: FEED_EXECUTION_ERROR_TYPE_KR[value],
        value,
      })),
    ],
  },
  failedAtStage: {
    label: "실패 단계",
    type: "multi-select",
    options: [
      { label: "전체", value: "all" },
      ...Object.values(FEED_EXECUTION_STAGE).map((value) => ({
        label: FEED_EXECUTION_STAGE_KR[value],
        value,
      })),
    ],
  },
  startedAt: {
    label: "시작일",
    type: "date-range",
  },
  finishedAt: {
    label: "종료일",
    type: "date-range",
  },
} as const;

export type AdminFeedExecutionLogFilterKey =
  keyof typeof ADMIN_FEED_EXECUTION_LOG_FILTER_CONFIG;

export type AdminFeedExecutionLogsQuery = {
  search: string;
  searchField: AdminFeedExecutionLogSearchField;
  sort: AdminFeedExecutionLogSort;
  sortOrder: SortOrder;
  page: number;
  limit: AdminFeedExecutionLogPageSize;
  filters: Partial<Record<AdminFeedExecutionLogFilterKey, FilterValue>>;
};
