/**
 * 피드 관련 TanStack Query Key 관리 상수
 */
export const FEED_QUERY_KEYS = {
  /** 피드 관련 모든 쿼리의 루트 키 */
  all: ["feeds"] as const,

  /** * 사이트 URL에서 피드를 탐색하는 쿼리 키 생성기
   * @param {string} url - 탐색 대상 사이트 주소
   */
  discoveryQuery: (url: string) =>
    [...FEED_QUERY_KEYS.all, "discoveryQuery", url] as const,
};
