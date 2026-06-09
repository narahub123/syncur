import { FeedItem } from "@/shared/types/feed";
import { FEED_CONFIG } from "../../constants/feed-config";

/**
 * FeedItem의 시간 기준 정렬 + cursor 기반 pagination 처리 함수
 *
 * 책임:
 * - 최신순 정렬 유지
 * - cursor 기반 slice 계산
 * - nextCursor / hasNext 계산
 *
 * 특징:
 * - 순수 함수 (side-effect 없음)
 * - 테스트 가능
 * - feed business logic과 독립
 */
export function paginateFeedItems(params: {
  items: FeedItem[];
  cursor?: string;
}) {
  const { items, cursor } = params;

  /**
   * item 기준 시간 계산 함수
   * publishedAt 우선, 없으면 createdAt 사용
   */
  const getItemTime = (item: FeedItem): number =>
    new Date(item.publishedAt ?? item.createdAt ?? 0).getTime();

  /**
   * cursor string → timestamp 변환
   */
  const parseCursorTime = (cursor?: string): number | null =>
    cursor ? new Date(cursor).getTime() : null;

  // =========================
  // 1. 최신순 정렬
  // =========================
  const sorted = [...items].sort((a, b) => {
    return getItemTime(b) - getItemTime(a);
  });

  // =========================
  // 2. cursor 기준 시작 index 계산
  // =========================
  const cursorTime = parseCursorTime(cursor);

  const startIndex = cursorTime
    ? sorted.findIndex((item) => getItemTime(item) < cursorTime) + 1
    : 0;

  // =========================
  // 3. 페이지 slice
  // =========================
  const pagedItems = sorted.slice(
    startIndex,
    startIndex + FEED_CONFIG.FEED_PAGINATION_LIMIT,
  );

  // =========================
  // 4. nextCursor 생성
  // =========================
  const lastItem = pagedItems[pagedItems.length - 1];

  const nextCursor = lastItem
    ? new Date(getItemTime(lastItem)).toISOString()
    : null;

  // =========================
  // 5. hasNext 계산
  // =========================
  const hasNext =
    startIndex + FEED_CONFIG.FEED_PAGINATION_LIMIT < sorted.length;

  // =========================
  // 6. 결과 반환
  // =========================
  return {
    pagedItems,
    nextCursor,
    hasNext,
  };
}
