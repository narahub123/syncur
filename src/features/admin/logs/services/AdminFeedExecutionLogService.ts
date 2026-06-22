import { AdminFeedExecutionLogsQuery } from "../types/search";
import { PAGINATION } from "@/shared/constants/pagination";
import { ADMIN_CONFIG } from "../../constants/admin-config";
import { DashboardResponse } from "../../sites/types/stats";
import {
  FeedExecutionLogWithFeedAndSiteDto,
  FeedExecutionLogWithFeedAndSiteDtoAndObservations,
} from "@/features/feed-execution-logs/dto/feedExecutionLogDto";
import {
  toFeedExecutionLogWithFeedAndSiteDto,
  toFeedExecutionLogWithFeedAndSiteDtos,
} from "@/features/feed-execution-logs/mappers/toFeedExecutionLogWithFeedAndSiteDto";
import { FeedExecutionLogStatsDto } from "@/features/feed-execution-logs/dto/feedExecutionLogStatsDto";
import { adminFeedExecutionLogRepository } from "../repositories/AdminFeedExecutionLogRepository.instance";
import { adminFeedExecutionLogStatsService } from "./AdminFeedExecutionLogStatsService.instance";
import { feedFetchObservationService } from "@/features/feed-fetch-observation/services/FeedFetchObservationService.instance";

export default class AdminFeedExecutionLogService {
  /**
   * Feed Execution Log 목록 조회
   *
   * - admin / monitoring 용
   */
  async getFeedExecutionLogsPaginated(
    query: AdminFeedExecutionLogsQuery,
  ): Promise<
    DashboardResponse<
      FeedExecutionLogWithFeedAndSiteDto,
      FeedExecutionLogStatsDto
    >
  > {
    const page = query.page ?? PAGINATION.DEFAULT_PAGE;
    const limit =
      query.limit ?? ADMIN_CONFIG.FEED_EXECUTION_LOGS.PAGINATION_LIMIT;

    const [{ items, totalCount }, stats] = await Promise.all([
      adminFeedExecutionLogRepository.findAllPaginated({
        page,
        limit,
        search: query.search,
        searchField: query.searchField,
        sort: query.sort,
        sortOrder: query.sortOrder,
        filters: query.filters,
      }),
      adminFeedExecutionLogStatsService.getStats(),
    ]);

    console.log("dfasfs", stats);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: toFeedExecutionLogWithFeedAndSiteDtos(items),
      stats,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    };
  }

  async getLogDetailById(
    id: string,
  ): Promise<FeedExecutionLogWithFeedAndSiteDtoAndObservations> {
    /**
     * 1. 전송 인자 검증 (방어 코드)
     */
    if (!id || id.trim().length === 0) {
      throw new Error("올바르지 않은 로그 식별자입니다.");
    }

    try {
      /**
       * 2. 기존 목록 뼈대를 재활용한 레포지토리 단건 조회 실행
       * - 레포지토리 결과 타입이 확실히 추론되므로 any가 필요 없습니다.
       */
      const logDetail = await adminFeedExecutionLogRepository.findOneById(id);

      /**
       * 3. 예외 예방 조치: 존재하지 않는 데이터인 경우 가드
       */
      if (!logDetail) {
        console.warn(
          `⚠️ [Service] 해당 ID의 장애 로그를 찾을 수 없습니다: ${id}`,
        );
        throw new Error("해당 장애 로그 상세 정보를 찾을 수 없습니다.");
      }

      const observations = await feedFetchObservationService.findByExecutionId(
        logDetail.executionId,
      );

      // 💡 4. 비즈니스 규격 DTO 변환 후 온전한 인스턴스로 반환
      const log = toFeedExecutionLogWithFeedAndSiteDto(logDetail);
      return {
        ...log,
        observations,
      };
    } catch (error: unknown) {
      // error가 자바스크립트 Error 인스턴스인지 안전하게 가드(Type Guard)
      if (error instanceof Error) {
        // 💡 내부에 이미 발생한 고유 예외("해당 장애 로그를 찾을 수 없습니다" 등)는 그대로 상위로 튕겨냄
        throw error;
      }

      console.error(`❌ [Service] 장애 로그 조회 중 시스템 에러 발생:`, error);
      throw new Error(
        "장애 로그를 불러오는 도중 알 수 없는 오류가 발생했습니다.",
      );
    }
  }
}
