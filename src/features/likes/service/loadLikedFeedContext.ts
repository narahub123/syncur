import { subscriptionRepository } from "@/features/subscriptions/repository/SubscriptionRepository.instance";

import { siteRepository } from "@/features/rss/site/repository/SiteRepository.instance";
import { feedItemRepository } from "@/features/feed-items/repositories/FeedItemRepository.instance";
import { userFeedInteractionRepository } from "@/features/feed-interaction/repositories/UserFeedInteractionRepository.instance";
import { FeedItemLean } from "@/shared/types/domain-leans";
import { feedRepository } from "@/features/feeds/repository/FeedRepository.instance";
import { SiteLean } from "@/features/rss/site/types/leans";
import { FeedLean } from "@/features/feeds/types/leans";

type FeedContext = {
  items: FeedItemLean[];
  feedMap: Map<string, FeedLean>;
  siteMap: Map<string, SiteLean>;
  subscribedMap: Map<string, Date>;
};

/**
 * Like 필터가 적용된 Feed Context 로딩
 *
 * 구조:
 * subscription (feed scope)
 *   ↓
 * feedItem (전체 로딩)
 *   ↓
 * userFeedInteraction (hasLiked 필터)
 *   ↓
 * 기존 feed pipeline 그대로 유지
 */
export async function loadLikedFeedContext(
  userId: string,
): Promise<FeedContext> {
  // =========================
  // 1. subscription 기반 feed scope
  // =========================
  const subscriptions = await subscriptionRepository.findByUserId(userId);

  if (!subscriptions.length) {
    return {
      items: [],
      feedMap: new Map(),
      siteMap: new Map(),
      subscribedMap: new Map(),
    };
  }

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
  // 2. feed / site / item 로딩 (기존과 동일)
  // =========================
  const feeds = await feedRepository.findByIds(feedIds);

  const sites = await siteRepository.findByIds([
    ...new Set(feeds.map((f) => f.siteId.toString())),
  ]);

  const items = await feedItemRepository.findByFeedIds(feedIds);

  // =========================
  // 3. interaction 조회 (LIKE 필터용)
  // =========================
  const interactions =
    await userFeedInteractionRepository.findByUserAndFeedItemIds(
      userId,
      items.map((i) => i._id.toString()),
    );

  const likedSet = new Set(
    interactions.filter((i) => i.hasLiked).map((i) => i.feedItemId.toString()),
  );

  // =========================
  // 4. LIKE 필터 적용 (핵심 변경 부분)
  // =========================
  const filteredItems = items.filter((item) =>
    likedSet.has(item._id.toString()),
  );

  // =========================
  // 5. map 구조 생성 (기존 동일)
  // =========================
  const feedMap = new Map(feeds.map((f) => [f._id.toString(), f]));

  const siteMap = new Map(sites.map((s) => [s._id.toString(), s]));

  // =========================
  // 6. context 반환
  // =========================
  return {
    items: filteredItems,
    feedMap,
    siteMap,
    subscribedMap,
  };
}
