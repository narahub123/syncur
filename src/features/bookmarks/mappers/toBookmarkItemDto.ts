import { FeedLean } from "@/features/feeds/types/leans";
import { SiteLean } from "@/features/rss/site/types/leans";
import {
  BookmarkCollectionLean,
  FeedItemLean,
  FeedItemStatsLean,
  UserFeedInteractionLean,
} from "@/shared/types/domain-leans";

export function toBookmarkItemDto(params: {
  item: FeedItemLean;

  feedMap: Map<string, FeedLean>;
  siteMap: Map<string, SiteLean>;

  interactionMap: Map<string, UserFeedInteractionLean>;
  statsMap: Map<string, FeedItemStatsLean>;
  collectionMap: Map<string, BookmarkCollectionLean | undefined>;
}) {
  const { item, feedMap, siteMap, interactionMap, statsMap, collectionMap } =
    params;

  // =========================
  // 1. feed / site resolve
  // =========================
  const feed = feedMap.get(item.feedId.toString());
  if (!feed) throw new Error("Feed missing");

  const site = siteMap.get(feed.siteId.toString());
  if (!site) throw new Error("Site missing");

  // =========================
  // 2. interaction / stats resolve
  // =========================
  const interaction = interactionMap.get(item._id.toString());
  const stats = statsMap.get(item._id.toString());

  // =========================
  // 3. collection  resolve
  // =========================
  const collection = collectionMap.get(item._id.toString());

  // =========================
  // 3. DTO 변환
  // =========================
  return {
    meta: {
      site: {
        siteId: site._id.toString(),
        url: site.url,
        favicon_url: site.favicon_url,
        name: site.name,
        feedStatus: site.feedStatus,
      },
      feedId: feed._id.toString(),
      publishedAt:
        item.publishedAt?.toISOString() ?? item.createdAt.toISOString(),
      feedItemId: item._id.toString(),
    },

    content: {
      feedItemId: item._id.toString(),
      title: item.title,
      description: item.description,
      link: item.link,
    },

    categories: item.categories ?? [],

    interaction: {
      hasLiked: interaction?.hasLiked ?? false,
      hasBookmarked: interaction?.hasBookmarked ?? false,
      isHidden: interaction?.isHidden ?? false,

      hasContentClicked: interaction?.hasContentClicked ?? false,
      hasSourceClicked: interaction?.hasSourceClicked ?? false,

      lastInteractedAt: interaction?.lastInteractedAt?.toISOString() ?? null,
      lastContentClickedAt:
        interaction?.lastContentClickedAt?.toISOString() ?? null,
      lastSourceClickedAt:
        interaction?.lastSourceClickedAt?.toISOString() ?? null,
      lastLikedAt: interaction?.lastLikedAt?.toISOString() ?? null,
      lastBookmarkedAt: interaction?.lastBookmarkedAt?.toISOString() ?? null,
      hiddenAt: interaction?.hiddenAt?.toISOString() ?? null,
    },

    stats: {
      contentClickCount: stats?.contentClickCount ?? 0,
      sourceClickCount: stats?.sourceClickCount ?? 0,
      likeCount: stats?.likeCount ?? 0,
      bookmarkCount: stats?.bookmarkCount ?? 0,
      shareCount: stats?.shareCount ?? 0,
      lastInteractedAt: stats?.lastInteractedAt?.toISOString() ?? null,
    },

    collection: collection
      ? {
          collectionId: collection._id.toString(),
          collectionName: collection.name,
        }
      : null,
  };
}
