import { SITE_FEED_STATUS } from "../constants/site";

/**
 * Site의 피드 수집 가능 상태 타입
 *
 * SITE_FEED_STATUS 상수 객체로부터 자동 파생된 유니온 타입
 * (RSS | CRAWLABLE | UNAVAILABLE)
 */
export type SiteFeedStatus =
  (typeof SITE_FEED_STATUS)[keyof typeof SITE_FEED_STATUS];

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

export type RawRssItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  published?: string;
  date?: string;
};

export type RawAtomLink =
  | string
  | {
      $?: {
        href?: string;
      };
    };

export type RawAtomEntry = {
  title?: string;
  link?: RawAtomLink | RawAtomLink[];
  updated?: string;
  published?: string;
  date?: string;
};

export type ParsedFeedItem = {
  title: string;
  link: string;
  publishedAt?: Date;
};
