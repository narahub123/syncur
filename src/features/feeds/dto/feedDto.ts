export type SiteDto = {
  siteId: string;
  url: string;
  name: string;
  favicon_url: string | null;
  feed_url: string | null;
};

export type FeedItemMetaDto = {
  site: SiteDto;
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
