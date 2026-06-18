import { SiteStatsDto } from "@/features/rss/site/dto/siteStatsDto";
import { AdminSiteStatsRepository } from "../repositories/AdminSiteStatsRepository";

export class AdminSiteStatsService {
  constructor(private statsRepo: AdminSiteStatsRepository) {}

  /**
   * 통계 데이터를 조회하여 DTO 형태로 반환
   */
  async getStats(): Promise<SiteStatsDto> {
    const stats = await this.statsRepo.getStats();

    // DB 모델에서 필요한 필드만 추출하여 DTO로 변환
    return {
      total: stats.total,
      canRss: stats.canRss,
      noRss: stats.noRss,
    };
  }

  /**
   * 사이트 수집 상태 변경에 따른 통계 증감 로직
   * @param increment 값 (예: { total: 1, canRss: 1 })
   */
  async updateStats(increment: {
    total?: number;
    canRss?: number;
    noRss?: number;
  }) {
    return await this.statsRepo.incrementStats(increment);
  }
}
