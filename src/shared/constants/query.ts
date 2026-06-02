/**
 * URLSearchParams에서 사용하는 공통 쿼리 파라미터 키.
 *
 * 목적:
 * - 쿼리 문자열 하드코딩을 방지한다.
 * - 페이지 간 동일한 파라미터 이름을 일관되게 사용한다.
 * - 오타로 인한 버그를 줄인다.
 *
 * 예:
 * /feed?tab=popular
 * /subscriptions?page=2
 * /likes?page=1&query=react
 * /feed?tab=popular&period=week
 */
export const QUERY_PARAM = {
  TAB: "tab", // 피드 탭
  PAGE: "page", // 페이지네이션
  LIMIT: "limit", // 페이지 크기
  QUERY: "query", // 검색어
  PERIOD: "period", // 인기글 기간
} as const;
