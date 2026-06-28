import { SiteFeedStatus } from "../site/types";

export type SiteDiscoveryResult = {
  /**
   * 정규화된 원본 페이지 URL
   */
  url: string;

  /**
   * 사이트 표시명
   * RSS title → HTML title → hostname 순 fallback
   */
  name: string;

  /**
   * 파비콘 URL (없으면 null)
   */
  favicon_url: string | null;

  /**
   * 피드 수집 가능 상태
   *
   * - rss: RSS/Atom 기반 수집 가능
   * - crawlable: 목록 페이지 기반 크롤링 가능
   * - unavailable: 수집 불가
   */
  feedStatus: SiteFeedStatus;
};
