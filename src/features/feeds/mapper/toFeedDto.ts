import { FeedDto } from "../dto/feedDto";
import { FeedLean } from "../types/leans";

export function toFeedDto(feed: FeedLean): FeedDto {
  return {
    id: feed._id.toString(),

    siteId: feed.siteId.toString(),

    uniqueKey: feed.uniqueKey,

    sourceType: feed.sourceType,

    name: feed.name,

    feedUrl: feed.feedUrl,

    listingPageUrl: feed.listingPageUrl,

    listingPageConfig: feed.listingPageConfig,

    detailPageConfig: feed.detailPageConfig,

    crawlerState: {
      lastSeenUrl: feed.crawlerState?.lastSeenUrl ?? null,
      lastCrawledAt: feed.crawlerState?.lastCrawledAt
        ? feed.crawlerState.lastCrawledAt.toISOString()
        : null,
    },

    status: feed.status,

    lastFetchedAt: feed.lastFetchedAt ? feed.lastFetchedAt.toISOString() : null,

    etag: feed.etag,

    lastModified: feed.lastModified,

    errorCount: feed.errorCount,

    categories: feed.categories,

    subscriberCount: feed.subscriberCount,

    createdAt: feed.createdAt.toISOString(),

    updatedAt: feed.updatedAt.toISOString(),
  };
}

export function toFeedDtos(feeds: FeedLean[]): FeedDto[] {
  return feeds.map(toFeedDto);
}
