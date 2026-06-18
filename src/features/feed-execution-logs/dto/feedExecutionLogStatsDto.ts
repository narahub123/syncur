/**
 * Feed Execution Log 통계
 *
 * 관리자 대시보드용 요약 정보
 */
export interface FeedExecutionLogStatsDto {
  /**
   * 전체 실행 로그 수
   */
  total: number;

  /**
   * 실패한 실행 로그 수
   *
   * status === "failed"
   */
  fails: number;
}
