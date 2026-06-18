import { FeedStatsDto } from "@/features/feeds/dto/feedStatsDto";
import { AdminFeedStatsRepository } from "../repositories/AdminFeedStatsRepository";

export class AdminFeedStatsService {
  constructor(private statsRepo: AdminFeedStatsRepository) {}

  /**
   * 통계 데이터를 조회하여 DTO 형태로 반환
   */
  async getStats(): Promise<FeedStatsDto> {
    const stats = await this.statsRepo.getStats();

    // DB 모델에서 필요한 필드만 추출하여 DTO로 변환
    return {
      total: stats.total,
      active: stats.active,
      inactive: stats.inactive,
    };
  }

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
