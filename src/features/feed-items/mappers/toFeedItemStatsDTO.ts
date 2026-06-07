import { FeedItemStatsDTO } from "../dtos/feedItemStatsDTO";
import { FeedItemStatsDocument } from "../models/feed-item-stats";

export function toFeedItemStatsDTO(
  doc: FeedItemStatsDocument,
): FeedItemStatsDTO {
  return {
    feedItemId: doc.feedItemId.toString(),

    contentClickCount: doc.contentClickCount,
    sourceClickCount: doc.sourceClickCount,

    likeCount: doc.likeCount,
    bookmarkCount: doc.bookmarkCount,
    shareCount: doc.shareCount,

    lastInteractedAt: doc.lastInteractedAt?.toISOString() ?? null,

    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
