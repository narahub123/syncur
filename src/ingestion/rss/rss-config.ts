export const RSS_CONFIG = {
  /**
   * RSS fetch 기본 설정
   */
  RSS_FETCH_TIMEOUT: 8000,
  RSS_USER_AGENT: "Syncur RSS Bot",
  RSS_ACCEPT: "application/rss+xml, application/xml, text/xml",

  /**
   * cron 실행 주기
   */
  CRON_SCHEDULE: "*/1 * * * *",

  /**
   * feed 재조회 최소 간격
   * - lastFetchedAt 기준 필터링에 사용
   */
  FETCH_INTERVAL_MS: 5 * 60 * 1000, // 5분 (주석과 값 일치시킴)

  /**
   * feed 상태 정의
   */
  STATUS: {
    ACTIVE: "active",
    ERROR: "error",
    DISABLED: "disabled",
  },

  /**
   * 연속 실패 허용 횟수
   * - 이 값 초과 시 feed 자동 비활성화(disabled)
   */
  ERROR_THRESHOLD: 5,

  // ======================================================
  // Retry / Backoff 정책 (추가)
  // ======================================================

  /**
   * RSS fetch 재시도 횟수
   * - 일시적 네트워크 오류 대응
   */
  MAX_RETRY_COUNT: 3,

  /**
   * retry 간격 계산 기준값 (ms)
   * - exponential backoff의 base 값
   *   예: 1000 → 1000ms, 2000ms, 4000ms
   */
  RETRY_BACKOFF_BASE_MS: 1000,

  /**
   * retry 대상이 되는 에러 유형
   * - 이 에러들은 일시 장애로 판단하고 retry 수행
   */
  RETRYABLE_ERRORS: [
    "ETIMEDOUT",
    "ECONNRESET",
    "ENOTFOUND",
    "EAI_AGAIN",
    "RSS_FETCH_TIMEOUT",
    "RSS_HTTP_ERROR_5",
  ],

  /**
   * retry 하지 않는 에러 유형
   * - 구조적 문제 (retry해도 의미 없음)
   */
  NON_RETRYABLE_ERRORS: [
    "RSS_HTTP_ERROR_404",
    "RSS_HTTP_ERROR_410",
    "RSS_PARSE_ERROR",
    "INVALID_XML",
  ],

  /**
   * recovery 재시도 쿨다운 시간 (ms)
   *
   * - disabled 상태로 전환된 feed가
   *   다시 복구 시도되기까지 기다리는 최소 시간
   *
   * - 너무 짧으면 실패 feed를 계속 retry하게 되어 비효율 발생
   * - 너무 길면 실제로 복구 가능한 feed가 늦게 살아남
   *
   * 권장:
   * - 초기: 30분
   * - 운영 안정화 이후 feed 성격에 따라 조정 가능
   */
  RECOVERY_COOLDOWN_MS: 30 * 60 * 1000,

  /**
   * Feed description 최대 길이
   *
   * - RSS description이 없을 경우 content에서 생성
   * - 피드 카드 preview 용도로 사용
   * - 과도하게 긴 본문 저장 방지
   */
  DESCRIPTION_MAX_LENGTH: 200,
} as const;
