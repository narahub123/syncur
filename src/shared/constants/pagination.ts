/**
 * 페이지 기반 목록 조회 기본 설정값.
 *
 * 사용처:
 * - 구독 목록
 * - 좋아요 목록
 * - 북마크 목록
 * - 숨김 목록
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
} as const;

/**
 * 무한 스크롤 목록 조회 기본 설정값.
 *
 * 사용처:
 * - 피드 탭
 * - 인기 탭
 * - 추천 탭
 */
export const CURSOR_PAGINATION = {
  DEFAULT_LIMIT: 10,
} as const;
