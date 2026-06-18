import { FeedExecutionLogStatsDto } from "@/features/feed-execution-logs/dto/feedExecutionLogStatsDto";
import { FeedExecutionLogStatsRepository } from "../repository/FeedExecutionLogStatsRepository";

export class FeedExecutionLogStatsService {
  constructor(private statsRepo: FeedExecutionLogStatsRepository) {}

  /**
   * Feed Execution Log 통계 증감 로직
   * @param increment 값 (예: { total: 1, fails: 1 })
   */
  async updateStats(increment: { total?: number; fails?: number }) {
    return await this.statsRepo.incrementStats(increment);
  }
}
