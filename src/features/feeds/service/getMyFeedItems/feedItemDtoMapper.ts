import { SiteLean } from "@/features/rss/site/types/leans";
import {
  FeedItemLean,
  FeedItemStatsLean,
  FeedLean,
  UserFeedInteractionLean,
} from "@/shared/types/domain-leans";

/**
 * FeedItem + 관련 Map 데이터를 기반으로
 * 최종 API Response DTO로 변환하는 Mapper
 *
 * 책임:
 * - domain model → response DTO 변환
 * - service 로직 포함 금지 (조회/필터/페이지네이션 X)
 * - 오직 "형태 변환"만 수행
 */
export function mapFeedItemToDto(params: {
  item: FeedItemLean;

  feedMap: Map<string, FeedLean>;
  siteMap: Map<string, SiteLean>;

  interactionMap: Map<string, UserFeedInteractionLean>;
  statsMap: Map<string, FeedItemStatsLean>;
}) {
  const { item, feedMap, siteMap, interactionMap, statsMap } = params;

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
  // 3. DTO 변환
  // =========================
  return {
    meta: {
      site: {
        siteId: site._id.toString(),
        url: site.url,
        favicon_url: site.favicon_url,
        name: site.name,
        feed_url: site.feed_url,
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
  };
}
