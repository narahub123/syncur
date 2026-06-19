import { FeedDto } from "../dto/feedDto";
import { FeedLean } from "../types/leans";

export function toFeedDto(feed: FeedLean): FeedDto {
  return {
    id: feed._id.toString(),

    siteId: feed.siteId.toString(),

    feedUrl: feed.feedUrl,

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
