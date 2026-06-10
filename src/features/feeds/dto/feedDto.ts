import { FeedItemSiteDto } from "@/features/rss/site/dto/siteDto";
import { CursorPaginationResponse } from "@/shared/types/pagination";

export type FeedItemMetaDto = {
  site: FeedItemSiteDto;
  publishedAt: string;
  feedItemId: string;
  feedId: string;
};

export type FeedItemContentDto = {
  feedItemId: string;
  title: string;
  description: string;
  link: string;
};

export type FeedItemInteractionDto = {
  hasLiked: boolean;
  hasBookmarked: boolean;
  isHidden: boolean;

  hasContentClicked: boolean;
  hasSourceClicked: boolean;

  lastInteractedAt: string | null;
  lastContentClickedAt: string | null;
  lastSourceClickedAt: string | null;
  lastLikedAt: string | null;
  lastBookmarkedAt: string | null;
  hiddenAt: string | null;
};

export type FeedItemStatsDto = {
  contentClickCount: number;
  sourceClickCount: number;
  likeCount: number;
  bookmarkCount: number;
  shareCount: number;

  lastInteractedAt: string | null;
};

export type FeedItemResponse = {
  meta: FeedItemMetaDto;
  content: FeedItemContentDto;
  categories: string[];
  stats: FeedItemStatsDto;
  interaction: FeedItemInteractionDto;
};

export type FeedState =
  | "NO_SUBSCRIPTION"
  | "EMPTY_FEED"
  | "HAS_DATA"
  | "UNAUTHORIZED"
  | "FEED_FETCH_FAILED"
  | "BOOKMARK_FETCH_FAILED";

/**
 * Feed 비즈니스 상태 정의
 *
 * - NO_SUBSCRIPTION: 사용자가 구독한 feed가 없는 상태
 * - EMPTY_FEED: 구독은 있지만 조건에 맞는 feed item이 없는 상태
 * - HAS_DATA: 정상적으로 feed item이 존재하는 상태
 * - UNAUTHORIZED: 인증되지 않은 사용자
 * - FEED_FETCH_FAILED: 서버/DB 조회 실패
 */
export type FeedResponse = CursorPaginationResponse<FeedItemResponse> & {
  status: FeedState; // UI에서 분기 처리를 위한 feed 상태 값
};

/**
 * Server Action 응답 구조
 *
 * - success: 서버 요청 성공 여부 (transport 레벨)
 * - data: 실제 feed 데이터 (pagination + status 포함)
 * - error: 실패 시 에러 코드 또는 메시지
 *
 * ⚠️ success와 status는 역할이 다름:
 * - success → API 호출 성공/실패
 * - status → 비즈니스 로직 기준 데이터 상태
 */
export type FeedActionResponse = {
  success: boolean;
  data: FeedResponse;
  error?: string;
};
