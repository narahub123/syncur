/**
 * UI 상태 머신
 * subscription discovery workflow의 현재 단계
 */
export type UIState =
  | "idle" // 아무 입력 없음
  | "subscribing" // 전체 처리 진행 중
  | "subscribed" // 성공
  | "not_supported" // RSS 없음 (실패 결과)
  | "error"; // 시스템 에러

/**
 * Feed endpoint type
 * 웹사이트에서 발견된 구독 가능한 데이터 소스 유형
 *
 * 확장 가능:
 * - rss: classic RSS feed
 * - atom: Atom feed
 * - sitemap: sitemap 기반 feed
 */
export type FeedEndpointType = "rss" | "atom" | "sitemap";

/**
 * FeedEndpoint
 * 실제 구독 가능한 feed 리소스
 *
 * 역할:
 * - WebSource에서 발견된 구독 endpoint
 * - subscription 대상
 */
export type FeedEndpoint = {
  id: string;
  url: string; // feed URL
  title?: string; // feed title (optional metadata)
  type?: FeedEndpointType; // feed 종류
  confidence?: number; // discovery confidence score (0~1)
};
