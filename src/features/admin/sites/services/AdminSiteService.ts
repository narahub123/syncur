import { AdminSiteRepository } from "../repositories/AdminSiteRepository";
import { AdminSiteQuery } from "../types/search";
import { SiteDto } from "@/features/rss/site/dto/siteDto";
import { toSiteDtos } from "@/features/rss/site/mappers/toSiteDto";
import { AdminSiteStatsService } from "./AdminSiteStatsService";
import { DashboardResponse } from "../types/stats";

export class AdminSiteService {
  private readonly adminSiteRepository: AdminSiteRepository;

  constructor(
    adminSiteRepository: AdminSiteRepository,
    private statsService: AdminSiteStatsService,
  ) {
    this.adminSiteRepository = adminSiteRepository;
  }

  /**
   * 사이트 목록 조회 서비스 로직
   * @param query 클라이언트로부터 받은 쿼리 객체
   */
  async getSites(query: AdminSiteQuery): Promise<DashboardResponse<SiteDto>> {
    try {
      const [result, stats] = await Promise.all([
        this.adminSiteRepository.getSites(query),
        this.statsService.getStats(),
      ]);

      return {
        ...result,
        items: toSiteDtos(result.items),
        stats,
      };
    } catch (error) {
      // 에러 로깅 후 상위 계층(Action)으로 던짐
      console.error("Error in AdminSiteService.getSites:", error);
      throw new Error("사이트 목록을 가져오는 중 오류가 발생했습니다.");
    }
  }
}
