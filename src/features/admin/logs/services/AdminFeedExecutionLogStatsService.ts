import { FeedExecutionLogStatsDto } from "@/features/feed-execution-logs/dto/feedExecutionLogStatsDto";
import { AdminFeedExecutionLogStatsRepository } from "../repositories/AdminFeedExecutionLogStatsRepository";

export class AdminFeedExecutionLogStatsService {
  constructor(private statsRepo: AdminFeedExecutionLogStatsRepository) {}

  /**
   * 통계 데이터를 조회하여 DTO 형태로 반환
   */
  async getStats(): Promise<FeedExecutionLogStatsDto> {
    const stats = await this.statsRepo.getStats();

    // DB 모델에서 필요한 필드만 추출하여 DTO로 변환
    return {
      total: stats.total,
      fails: stats.fails,
    };
  }

  
}
