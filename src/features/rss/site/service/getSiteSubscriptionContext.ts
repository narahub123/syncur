import { buildSiteContext } from "@/features/rss/site/domain/siteContext";
import { siteRepository } from "@/features/rss/site/repository/SiteRepository.instance";
import { subscriptionRepository } from "@/features/subscriptions/repository/SubscriptionRepository.instance";
import { dedupedDiscoverSite } from "./dedupedDiscoverSite";
import { feedService } from "@/features/feeds/service/FeedService.instance";

export async function getSiteSubscriptionContext(
  normalizedUrl: string,
  userId: string,
) {
  /**
   * 1. URL 기준 Site 조회
   * - 기존에 저장된 Site가 있는지 확인
   */
  const siteStart = performance.now();

  let sites = await siteRepository.search(normalizedUrl);

  /**
   * 2. Site가 없으면 RSS discovery 수행
   * - 외부 요청 비용이 크므로 fallback 방식으로만 실행
   */
  if (sites.length === 0) {
    const discovered = await dedupedDiscoverSite(normalizedUrl);

    if (discovered) {
      const saved = await siteRepository.upsert(discovered);
      sites = [saved];
    }
  }

  console.log(`[PERF] site-search ${performance.now() - siteStart}ms`);

  /**
   * 3. Site → Feed 보장
   * - 모든 site는 feed를 반드시 가지도록 보장
   * - Subscription 기준이 feed로 전환되기 위한 준비 단계
   */
  const sitesWithFeeds = await Promise.all(
    sites.map(async (site) => {
      const feed = await feedService.ensureFeed(site);

      return {
        site,
        feed,
      };
    }),
  );

  /**
   * 4. 사용자 Subscription 조회
   * - Feed 기준으로 구독 여부 판단 준비
   */
  const subStart = performance.now();
  const subscriptions = await subscriptionRepository.findByUserId(userId);
  console.log(`[PERF] subscription ${performance.now() - subStart}ms`);

  /**
   * 5. subscription Set 생성
   * - O(1) lookup을 위해 string 변환
   */
  const subscribedFeedIds = new Set(
    subscriptions.map((s) => s.feedId.toString()),
  );

  /**
   * 6. UI Context 생성
   * - Site + Feed + Subscription 상태를 합쳐 반환
   */
  return sitesWithFeeds.map(({ site, feed }) => {
    const subscriptionExists = subscribedFeedIds.has(site._id.toString());

    return buildSiteContext({
      site,
      subscriptionExists,
      feed,
    });
  });
}
