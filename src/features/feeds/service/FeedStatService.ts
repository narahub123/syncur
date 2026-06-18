import { FeedStatsRepository } from "../repository/FeedStatsRepository";

export class FeedStatsService {
  constructor(private statsRepo: FeedStatsRepository) {}

  /**
   * Feed 상태 변경에 따른 통계 증감 로직
   * @param increment 값 (예: { total: 1, active: 1 })
   */
  async updateStats(increment: {
    total?: number;
    active?: number;
    inactive?: number;
  }) {
    return await this.statsRepo.incrementStats(increment);
  }
}
