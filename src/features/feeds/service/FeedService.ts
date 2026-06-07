import { Site } from "@/shared/types/site";
import { feedRepository } from "../repository/FeedRepository.instance";
import { Feed } from "@/shared/types/feed";
import { subscriptionRepository } from "@/features/subscriptions/repository/SubscriptionRepository.instance";
import { feedItemRepository } from "@/features/feed-items/respositories/FeedItemRespository.instance";
import { siteRepository } from "@/features/rss/site/repository/SiteRepository.instance";
import { FeedItemResponse } from "../dto/feedDto";
import { userFeedInteractionRepository } from "@/features/feed-interaction/repositories/UserFeedInteractionRepository.instance";
import { feedItemStatsRepository } from "@/features/feed-items/respositories/FeedItemStatsRepository.instance";

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

  async getMyFeedItems(userId: string): Promise<FeedItemResponse[]> {
    // 1. 구독 목록
    const subscriptions = await subscriptionRepository.findByUserId(userId);

    if (!subscriptions.length) return [];

    // 2. feedId → subscribedAt(Date로 강제 변환)
    const subscribedMap = new Map(
      subscriptions
        .map((s) => {
          if (!s.createdAt) return null;

          return [s.feedId.toString(), new Date(s.createdAt)] as const;
        })
        .filter(Boolean) as Array<[string, Date]>,
    );

    const feedIds = [...subscribedMap.keys()];

    const feeds = await feedRepository.findByIds(feedIds);

    const siteIds = [...new Set(feeds.map((f) => f.siteId.toString()))];

    const sites = await siteRepository.findByIds(siteIds);

    const siteMap = new Map(sites.map((s) => [s._id.toString(), s]));

    const feedMap = new Map(feeds.map((f) => [f._id.toString(), f]));

    // 3. feedItem 조회
    const items = await feedItemRepository.findByFeedIds(feedIds);

    // 4. 필터링 (시간 비교 안전하게)
    const filtered = items.filter((item) => {
      if (!item.publishedAt) return false;

      const subscribedAt = subscribedMap.get(item.feedId.toString());
      if (!subscribedAt) return false;

      return new Date(item.publishedAt).getTime() > subscribedAt.getTime();
    });

    // 5. 최신순 정렬
    filtered.sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() -
        new Date(a.publishedAt ?? 0).getTime(),
    );

    const feedItemIds = items.map((i) => i._id.toString());

    const interactions =
      await userFeedInteractionRepository.findByUserAndFeedIds(
        userId,
        feedItemIds,
      );

    const interactionMap = new Map(
      interactions.map((i) => [i.feedItemId.toString(), i]),
    );

    const statsList = await feedItemStatsRepository.findByFeedIds(feedItemIds);

    const statsMap = new Map(
      statsList.map((s) => [s.feedItemId.toString(), s]),
    );

    return filtered.map((item) => {
      const feed = feedMap.get(item.feedId.toString());
      if (!feed) throw new Error("Feed missing");

      const site = siteMap.get(feed.siteId.toString());
      if (!site) throw new Error("Site missing");

      const interaction = interactionMap.get(item._id.toString());
      const stats = statsMap.get(item._id.toString());

      console.log(item._id.toString());
      console.log(statsMap.keys());
      return {
        meta: {
          site: {
            _id: site._id.toString(),
            url: site.url,
            favicon_url: site.favicon_url,
            name: site.name,
            feed_url: site.feed_url,
          },
          publishedAt: item.publishedAt ?? "",
          feedItemId: item._id.toString(),
        },

        content: {
          _id: item._id.toString(),
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
  }
}
