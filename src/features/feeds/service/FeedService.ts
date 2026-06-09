import { Site } from "@/shared/types/site";
import { feedRepository } from "../repository/FeedRepository.instance";
import { Feed, FeedItem } from "@/shared/types/feed";
import { subscriptionRepository } from "@/features/subscriptions/repository/SubscriptionRepository.instance";
import { feedItemRepository } from "@/features/feed-items/respositories/FeedItemRespository.instance";
import { siteRepository } from "@/features/rss/site/repository/SiteRepository.instance";
import { FeedResponse } from "../dto/feedDto";
import { userFeedInteractionRepository } from "@/features/feed-interaction/repositories/UserFeedInteractionRepository.instance";
import { feedItemStatsRepository } from "@/features/feed-items/respositories/FeedItemStatsRepository.instance";
import { feedCondition } from "../utils/feedCondition";
import { FEED_CONFIG } from "../constants/feed-config";

export class FeedService {
  async ensureFeed(site: Site): Promise<Feed | null> {
    if (!site?.feed_url) return null;

    let feed = await feedRepository.findBySiteId(site._id);

    if (!feed) {
      feed = await feedRepository.create({
        siteId: site._id.toString(),
        feedUrl: site.feed_url,
        status: "active",
        errorCount: 0,
        categories: [],
      });
    }

    return feed;
  }

  async getMyFeedItems(userId: string, cursor?: string): Promise<FeedResponse> {
    // =========================
    // 1. 구독 목록 조회
    // =========================
    const subscriptions = await subscriptionRepository.findByUserId(userId);

    if (!subscriptions.length) {
      return {
        items: [],
        nextCursor: null,
        hasNext: false,
        status: "NO_SUBSCRIPTION",
      };
    }

    // =========================
    // 2. subscription map (feedId → subscribedAt)
    // =========================
    const subscribedMap = new Map(
      subscriptions
        .map((s) => {
          if (!s.createdAt) return null;
          return [s.feedId.toString(), new Date(s.createdAt)] as const;
        })
        .filter(Boolean) as Array<[string, Date]>,
    );

    const feedIds = [...subscribedMap.keys()];

    // =========================
    // 3. feed / site 조회
    // =========================
    const feeds = await feedRepository.findByIds(feedIds);

    const sites = await siteRepository.findByIds([
      ...new Set(feeds.map((f) => f.siteId.toString())),
    ]);

    const feedMap = new Map(feeds.map((f) => [f._id.toString(), f]));
    const siteMap = new Map(sites.map((s) => [s._id.toString(), s]));

    // =========================
    // 4. feed items 조회
    // =========================
    const items = await feedItemRepository.findByFeedIds(feedIds);

    /**
     * item 시간 통일 함수
     * - publishedAt 우선
     * - 없으면 createdAt 사용
     */
    const getItemTime = (item: FeedItem): number =>
      new Date(item.publishedAt ?? item.createdAt ?? 0).getTime();

    /**
     * cursor도 동일 기준으로 통일
     */
    const parseCursorTime = (cursor?: string): number | null =>
      cursor ? new Date(cursor).getTime() : null;

    // =========================
    // 5. 필터링
    // =========================
    const filtered = items.filter((item) => {
      return feedCondition(item, subscribedMap, 1);
    });

    // =========================
    // 6. 정렬 (최신순)
    // =========================
    filtered.sort((a, b) => {
      return getItemTime(b) - getItemTime(a);
    });

    // =========================
    // 7. cursor 기반 pagination
    // =========================
    const cursorTime = parseCursorTime(cursor);

    const startIndex = cursorTime
      ? filtered.findIndex((item) => getItemTime(item) < cursorTime) + 1
      : 0;

    const pagedItems = filtered.slice(
      startIndex,
      startIndex + FEED_CONFIG.FEED_PAGINATION_LIMIT,
    );

    // =========================
    // 8. nextCursor
    // =========================
    const lastItem = pagedItems[pagedItems.length - 1];

    const nextCursor = lastItem
      ? new Date(getItemTime(lastItem)).toISOString()
      : null;

    // =========================
    // 9. hasNext
    // =========================
    const hasNext =
      startIndex + FEED_CONFIG.FEED_PAGINATION_LIMIT < filtered.length;

    // =========================
    // 10. interaction 조회
    // =========================
    const feedItemIds = pagedItems.map((i) => i._id.toString());

    const interactions =
      await userFeedInteractionRepository.findByUserAndFeedIds(
        userId,
        feedItemIds,
      );

    const interactionMap = new Map(
      interactions.map((i) => [i.feedItemId.toString(), i]),
    );

    // =========================
    // 11. stats 조회
    // =========================
    const statsList = await feedItemStatsRepository.findByFeedIds(feedItemIds);

    const statsMap = new Map(
      statsList.map((s) => [s.feedItemId.toString(), s]),
    );

    // =========================
    // 12. DTO 변환
    // =========================
    const result = pagedItems.map((item) => {
      const feed = feedMap.get(item.feedId.toString());
      if (!feed) throw new Error("Feed missing");

      const site = siteMap.get(feed.siteId.toString());
      if (!site) throw new Error("Site missing");

      const interaction = interactionMap.get(item._id.toString());
      const stats = statsMap.get(item._id.toString());

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
          publishedAt: item.publishedAt ?? item.createdAt.toISOString(),
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

          lastInteractedAt:
            interaction?.lastInteractedAt?.toISOString() ?? null,
          lastContentClickedAt:
            interaction?.lastContentClickedAt?.toISOString() ?? null,
          lastSourceClickedAt:
            interaction?.lastSourceClickedAt?.toISOString() ?? null,
          lastLikedAt: interaction?.lastLikedAt?.toISOString() ?? null,
          lastBookmarkedAt:
            interaction?.lastBookmarkedAt?.toISOString() ?? null,
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
    });

    // =========================
    // 13. response
    // =========================
    return {
      items: result,
      nextCursor,
      hasNext,
      status: items.length === 0 ? "EMPTY_FEED" : "HAS_DATA",
    };
  }
}
