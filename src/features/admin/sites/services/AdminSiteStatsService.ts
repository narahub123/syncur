import { SiteStatsDto } from "@/features/sites/dto/siteStatsDto";
import { AdminSiteStatsRepository } from "../repositories/AdminSiteStatsRepository";

export class AdminSiteStatsService {
  constructor(private statsRepo: AdminSiteStatsRepository) {}

  /**
   * 통계 데이터를 조회하여 DTO 형태로 반환
   */
  async getStats(): Promise<SiteStatsDto> {
    const stats = await this.statsRepo.getStats();

    return {
      total: stats.total,
      rss: stats.rss,
      crawlable: stats.crawlable,
      unavailable: stats.unavailable,
    };
  }

  /**
   * 사이트 수집 상태 변경에 따른 통계 증감 로직
   */
  async updateStats(increment: {
    total?: number;
    rss?: number;
    crawlable?: number;
    unavailable?: number;
  }) {
    return await this.statsRepo.incrementStats(increment);
  }
}
