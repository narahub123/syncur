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
   * 발견된 RSS/Atom Feed URL (없으면 null)
   */
  feed_url: string | null;
};
