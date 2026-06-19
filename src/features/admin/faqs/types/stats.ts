export interface FaqStatsDto {
  /**
   * 전체 FAQ 수
   */
  totalCount: number;

  /**
   * 공개 FAQ 수
   */
  publishedCount: number;

  /**
   * 비공개 FAQ 수
   */
  hiddenCount: number;

  /**
   * 카테고리별 FAQ 수
   */
  categoryCounts: {
    payment: number;
    usage: number;
    bug: number;
    etc: number;
  };
}
