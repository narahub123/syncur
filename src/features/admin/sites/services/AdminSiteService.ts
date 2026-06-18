import { PaginatedResponse } from "@/shared/types/pagination";
import { AdminSiteRepository } from "../repositories/AdminSiteRepository";
import { AdminSiteQuery } from "../types/search";
import { SiteDto } from "@/features/rss/site/dto/siteDto";
import { toSiteDtos } from "@/features/rss/site/mappers/toSiteDto";

export class AdminSiteService {
  private readonly adminSiteRepository: AdminSiteRepository;

  constructor(adminSiteRepository: AdminSiteRepository) {
    this.adminSiteRepository = adminSiteRepository;
  }

  /**
   * 사이트 목록 조회 서비스 로직
   * @param query 클라이언트로부터 받은 쿼리 객체
   */
  async getSites(query: AdminSiteQuery): Promise<PaginatedResponse<SiteDto>> {
    try {
      // 1. 필요한 경우 여기서 추가적인 비즈니스 로직 처리 가능
      // 예: 특정 권한 체크, 데이터 마스킹, 로깅 등

      // 2. 리포지토리에 데이터 조회 위임
      const result = await this.adminSiteRepository.getSites(query);

      return {
        ...result,
        items: toSiteDtos(result.items),
      };
    } catch (error) {
      // 에러 로깅 후 상위 계층(Action)으로 던짐
      console.error("Error in AdminSiteService.getSites:", error);
      throw new Error("사이트 목록을 가져오는 중 오류가 발생했습니다.");
    }
  }
}
