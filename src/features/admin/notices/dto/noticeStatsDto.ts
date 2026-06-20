export interface NoticeStatsDto {
  /**
   * 전체 공지 개수
   */
  totalCount: number;

  /**
   * 공개 공지 개수
   */
  activeCount: number;

  /**
   * 비공개 공지 개수
   */
  inactiveCount: number;

  /**
   * 상단 고정 공지 개수
   */
  pinnedCount: number;
}
