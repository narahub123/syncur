import { FeedWithSiteDto, FeedWithSiteLean } from "../dto/feedDto";

/**
 * FeedWithSite Lean → DTO 변환
 *
 * 목적:
 * - MongoDB 타입(ObjectId, Date) → frontend-safe string 변환
 * - siteId → site rename
 */
export function toFeedWithSiteDto(feed: FeedWithSiteLean): FeedWithSiteDto {
  return {
    _id: feed._id.toString(),

    site: {
      _id: feed.siteId._id.toString(),
      name: feed.siteId.name,
      url: feed.siteId.url,
      favicon_url: feed.siteId.favicon_url,
      feedStatus: feed.siteId.feedStatus,
    },

    uniqueKey: feed.uniqueKey,

    sourceType: feed.sourceType,

    feedUrl: feed.feedUrl,

    listingPageUrl: feed.listingPageUrl,

    crawlerConfig: feed.crawlerConfig,

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

export function toFeedWithSiteDtos(feeds: FeedWithSiteLean[]) {
  return feeds.map(toFeedWithSiteDto);
}
