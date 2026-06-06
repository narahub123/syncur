import { buildSiteContext } from "@/features/rss/site/domain/siteContext";
import { siteRepository } from "@/features/rss/site/repository/SiteRepository.instance";
import { subscriptionRepository } from "@/features/subscriptions/repository/SubscriptionRepository.instance";
import { dedupedDiscoverSite } from "./dedupedDiscoverSite";

export async function getSiteSubscriptionContext(
  normalizedUrl: string,
  userId: string,
) {
  /**
   * 1. DB에서 URL 기준 site 후보 조회
   * - 이미 수집된 사이트가 있으면 그대로 사용
   * - search는 exact match + domain match 등을 포함할 수 있음
   */
  const siteStart = performance.now();

  let sites = await siteRepository.search(normalizedUrl);

  console.log(`[PERF] site-search ${performance.now() - siteStart}ms`);
  /**
   * 2. DB에 없으면 RSS 탐색(discovery) 수행
   * - 외부 사이트 요청 비용이 크므로
   *   DB 조회 결과가 없을 때만 실행
   * - 발견된 사이트는 저장 후 검색 결과에 포함
   */
  if (sites.length === 0) {
    const discovered = await dedupedDiscoverSite(normalizedUrl);

    if (discovered) {
      const saved = await siteRepository.upsert(discovered);
      sites = [saved];
    }
  }

  /**
   * 3. 사용자의 전체 구독 목록 조회
   * - 이후 site별 구독 여부를 빠르게 확인하기 위해
   *   Set으로 변환
   */
  const subStart = performance.now();
  const subscriptions = await subscriptionRepository.findByUserId(userId);
  console.log(`[PERF] subscription ${performance.now() - subStart}ms`);
  /**
   * siteId를 문자열 Set으로 변환
   *
   * MongoDB ObjectId는 값이 같아도 서로 다른 인스턴스이면
   * Set.has() 비교 시 false가 될 수 있으므로 문자열로 통일한다.
   *
   * 이후 site별 구독 여부를 O(1)로 조회할 수 있다.
   */
  const subscribedSiteIds = new Set(
    subscriptions.map((s) => s.siteId.toString()),
  );

  /**
   * 4. Site + Subscription 정보를 합쳐
   * UI에서 사용할 SiteContext 생성
   *
   * - subscriptionExists:
   *   현재 사용자가 해당 사이트를 구독 중인지 여부
   * - site._id 역시 문자열로 변환하여 비교
   */
  return sites.map((site) => {
    const subscriptionExists = subscribedSiteIds.has(site._id.toString());

    return buildSiteContext({
      site,
      subscriptionExists,
    });
  });
}
