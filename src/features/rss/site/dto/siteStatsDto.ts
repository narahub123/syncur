export type SiteStatsDto = {
  /** 전체 사이트 수 */
  total: number;

  /** RSS 기반 수집 가능한 사이트 수 */
  rss: number;

  /** 크롤링 기반 수집 가능한 사이트 수 */
  crawlable: number;

  /** 수집 불가능한 사이트 수 */
  unavailable: number;
};
