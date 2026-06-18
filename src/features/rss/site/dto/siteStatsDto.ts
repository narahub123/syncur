export type SiteStatsDto = {
  /** 전체 사이트 수 */
  total: number;

  /** RSS 수집 가능한 사이트 수 (canRss: true) */
  canRss: number;

  /** RSS 수집 불가능한 사이트 수 (canRss: false) */
  noRss: number;
};
