export interface FeedItemStatsDTO {
  feedItemId: string;

  contentClickCount: number;
  sourceClickCount: number;

  likeCount: number;
  bookmarkCount: number;
  shareCount: number;

  lastInteractedAt?: string | null;

  createdAt: string;
  updatedAt: string;
}
