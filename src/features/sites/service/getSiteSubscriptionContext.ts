import { subscriptionRepository } from "@/features/subscriptions/repository/SubscriptionRepository.instance";
import { dedupedDiscoverSite } from "./dedupedDiscoverSite";
import { feedService } from "@/features/feeds/service/FeedService.instance";
import { siteService } from "./SiteService.instance";
import { SITE_FEED_STATUS } from "../constants/site";
import { buildRssSiteContext } from "../domain/buildRssSiteContext";
import { buildCrawlSiteContext } from "../domain/buildCrawlSiteContext";
import { buildUnsupportedSiteContext } from "../domain/buildUnsupportedSiteContext";

export async function getSiteSubscriptionContext(
  normalizedUrl: string,
  userId: string,
) {
  /**
   * 1. URL 기준 Site 조회
   * - 기존에 저장된 Site가 있는지 확인
   */
  const siteStart = performance.now();

  // =========================
  // [1. 기존 사이트 조회]
  // =========================
  let sites = await siteService.search(normalizedUrl);
  /**
   * 2. Site가 없으면 RSS discovery 수행
   * - 외부 요청 비용이 크므로 fallback 방식으로만 실행
   */
  if (sites.length === 0) {
    const { site, success } = await dedupedDiscoverSite(normalizedUrl);

    if (success && site) {
      sites = [site];
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
      const feeds = await feedService.findBySiteId(site._id);

      return {
        site,
        feeds,
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
   * - FeedStatus에 따라 적절한 Context Builder 호출
   */
  return sitesWithFeeds.map(({ site, feeds }) => {
    /**
     * RSS 사이트
     *
     * - Site당 RSS Feed는 하나만 존재
     * - 해당 Feed의 구독 여부를 확인하여 Context 생성
     */
    if (site.feedStatus === SITE_FEED_STATUS.RSS) {
      const rssFeed = feeds.find((feed) => feed.sourceType === "rss");

      if (!rssFeed) {
        throw new Error("RSS Feed가 존재하지 않습니다.");
      }

      const subscriptionExists = subscribedFeedIds.has(rssFeed.id);

      return buildRssSiteContext({
        site,
        feed: rssFeed,
        subscriptionExists,
      });
    }

    /**
     * Crawl 가능한 사이트
     *
     * - Site는 여러 개의 Crawl Feed를 가진다.
     * - Feed 개수는 목록 페이지 개수와 동일하다.
     * - Feed 하나라도 구독 중이면 구독 중인 사이트로 판단한다.
     */
    if (site.feedStatus === SITE_FEED_STATUS.CRAWLABLE) {
      const crawlFeeds = feeds.filter((feed) => feed.sourceType === "crawl");

      const listingPageCount = crawlFeeds.length;

      const subscribedListingPages = crawlFeeds
        .filter((feed) => subscribedFeedIds.has(feed.id))
        .map((feed) => ({
          feedId: feed.id,
          title: feed.name ?? "이름 없음",
        }));

      const subscriptionExists = subscribedListingPages.length > 0;

      return buildCrawlSiteContext({
        site,
        listingPageCount,
        subscriptionExists,
        subscribedListingPages,
      });
    }

    /**
     * 구독을 지원하지 않는 사이트
     *
     * - RSS Feed 없음
     * - Crawl Feed 없음
     * - 구독 기능 비활성화
     */
    return buildUnsupportedSiteContext({
      site,
    });
  });
}
