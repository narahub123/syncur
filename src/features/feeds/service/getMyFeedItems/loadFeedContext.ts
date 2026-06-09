import { subscriptionRepository } from "@/features/subscriptions/repository/SubscriptionRepository.instance";
import { feedRepository } from "../../repository/FeedRepository.instance";
import { siteRepository } from "@/features/rss/site/repository/SiteRepository.instance";
import { feedItemRepository } from "@/features/feed-items/respositories/FeedItemRespository.instance";
import { FeedItem } from "@/shared/types/feed";
import { Site } from "@/shared/types/site";
import { FeedLean } from "@/shared/types/domain-leans";

type FeedContext = {
  items: FeedItem[];
  feedMap: Map<string, FeedLean>;
  siteMap: Map<string, Site>;
  subscribedMap: Map<string, Date>;
};

/**
 * Feed 조회에 필요한 모든 원본 데이터와
 * DTO 생성 전 단계의 context를 로딩하는 함수
 *
 * 책임:
 * - subscription 기반 feed scope 결정
 * - feed / site / item 데이터 로딩
 * - 이후 단계에서 사용할 map 구조 생성
 */
export async function loadFeedContext(userId: string): Promise<FeedContext> {
  // =========================
  // 1. 구독 목록 조회
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

  // =========================
  // 2. subscription map 생성
  // feedId -> subscribedAt
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
  // 3. feed 조회
  // =========================
  const feeds = await feedRepository.findByIds(feedIds);

  // =========================
  // 4. site 조회 (feed → siteId 기반)
  // =========================
  const sites = await siteRepository.findByIds([
    ...new Set(feeds.map((f) => f.siteId.toString())),
  ]);

  // =========================
  // 5. feed item 조회
  // =========================
  const items = await feedItemRepository.findByFeedIds(feedIds);

  // =========================
  // 6. map 구조 생성
  // =========================

  /**
   * feedId -> feed entity
   * DTO 생성 시 feed 정보 빠르게 접근하기 위함
   */
  const feedMap = new Map(feeds.map((f) => [f._id.toString(), f]));

  /**
   * siteId -> site entity
   * feed → site join을 O(1)로 처리하기 위한 구조
   */
  const siteMap = new Map(sites.map((s) => [s._id.toString(), s]));

  // =========================
  // 7. context 반환
  // =========================
  return {
    items,
    feedMap,
    siteMap,
    subscribedMap,
  };
}
