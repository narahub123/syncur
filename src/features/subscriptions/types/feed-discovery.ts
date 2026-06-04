/**
 * UI 상태 머신
 * subscription discovery workflow의 현재 단계
 */
export type UIState =
  | "idle" // 초기 상태, 아무 입력 없음
  | "typing" // URL 입력 중
  | "searching_site" // DB 또는 서버에서 site 검색 중
  | "site_selected" // 사용자가 site 선택 완료
  | "discovering" // feed endpoint 탐색 중 (crawler 실행)
  | "feed_found" // 구독 가능한 feed endpoint 발견됨
  | "feed_not_supported" // feed를 찾지 못함
  | "subscribing" // 구독 요청 처리 중
  | "subscribed" // 구독 완료
  | "error"; // 에러 상태

/**
 * WebSource
 * 사용자가 입력한 URL을 기반으로 식별된 사이트 엔티티
 *
 * 역할:
 * - URL 정규화 결과
 * - DB에 저장되는 기본 단위
 * - feed discovery의 시작점
 */
export type WebSource = {
  id: string; // 내부 식별자
  name: string; // 사이트 이름 (예: Dev.to)
  url: string; // canonical URL
};

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
