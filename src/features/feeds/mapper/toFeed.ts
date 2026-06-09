import { Feed } from "@/shared/types/feed";
import { FeedLean } from "@/shared/types/domain-leans";

export function toFeed(doc: FeedLean): Feed {
  return {
    id: doc._id.toString(),
    siteId: doc.siteId.toString(),
    feedUrl: doc.feedUrl,

    status: doc.status,
    errorCount: doc.errorCount,

    categories: doc.categories ?? [],

    lastFetchedAt: doc.lastFetchedAt?.toISOString(),
    etag: doc.etag,
    lastModified: doc.lastModified,
  };
}
