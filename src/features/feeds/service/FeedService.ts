import { Site } from "@/shared/types/site";
import { feedRepository } from "../repository/FeedRepository.instance";
import { Feed } from "@/shared/types/feed";
import { subscriptionRepository } from "@/features/subscriptions/repository/SubscriptionRepository.instance";
import { feedItemRepository } from "@/features/feed-items/respository/FeedItemRespository.instance";

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

  async getMyFeedItems(userId: string) {
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

    return filtered.map((item) => ({
      ...item,
      _id: item._id.toString(),
      feedId: item.feedId.toString(),
      publishedAt: item.publishedAt ? item.publishedAt : null,
    }));
  }
}
