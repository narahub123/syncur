import { FEED_CONFIG } from "@/features/feeds/constants/feed-config";
import { BookmarkItemDto } from "../dto/bookmarkDto";

/**
 * Bookmark 기준 최신순 정렬 + cursor pagination
 *
 * 기준:
 * - lastBookmarkedAt DESC (최신 북마크 순)
 *
 * 책임:
 * - 북마크 기준 정렬
 * - cursor 기반 slice
 * - nextCursor / hasNext 계산
 */
export function paginateBookmarkedItems(params: {
  items: BookmarkItemDto[];
  cursor?: string;
}) {
  const { items, cursor } = params;

  /**
   * 북마크 시간 기준
   */
  const getBookmarkTime = (item: BookmarkItemDto): number =>
    new Date(item.interaction.lastBookmarkedAt ?? 0).getTime();

  /**
   * cursor → timestamp
   */
  const parseCursorTime = (cursor?: string): number | null =>
    cursor ? new Date(cursor).getTime() : null;

  // =========================
  // 1. 북마크 최신순 정렬
  // =========================
  const sorted = [...items].sort((a, b) => {
    return getBookmarkTime(b) - getBookmarkTime(a);
  });

  // =========================
  // 2. cursor 기준 시작 index
  // =========================
  const cursorTime = parseCursorTime(cursor);

  const startIndex = cursorTime
    ? sorted.findIndex((item) => getBookmarkTime(item) < cursorTime) + 1
    : 0;

  // =========================
  // 3. slice
  // =========================
  const pagedItems = sorted.slice(
    startIndex,
    startIndex + FEED_CONFIG.FEED_PAGINATION_LIMIT,
  );

  // =========================
  // 4. nextCursor
  // =========================
  const lastItem = pagedItems[pagedItems.length - 1];

  const nextCursor = lastItem
    ? new Date(getBookmarkTime(lastItem)).toISOString()
    : null;

  // =========================
  // 5. hasNext
  // =========================
  const hasNext =
    startIndex + FEED_CONFIG.FEED_PAGINATION_LIMIT < sorted.length;

  return {
    pagedItems,
    nextCursor,
    hasNext,
  };
}
