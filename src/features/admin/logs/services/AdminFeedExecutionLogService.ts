import { AdminFeedExecutionLogsQuery } from "../types/search";
import { PAGINATION } from "@/shared/constants/pagination";
import { ADMIN_CONFIG } from "../../constants/admin-config";
import { DashboardResponse } from "../../sites/types/stats";
import { FeedExecutionLogWithFeedAndSiteDto } from "@/features/feed-execution-logs/dto/feedExecutionLogDto";
import { toFeedExecutionLogWithFeedAndSiteDtos } from "@/features/feed-execution-logs/mappers/toFeedExecutionLogWithFeedAndSiteDto";
import { FeedExecutionLogStatsDto } from "@/features/feed-execution-logs/dto/feedExecutionLogStatsDto";
import { adminFeedExecutionLogRepository } from "../repositories/AdminFeedExecutionLogRepository.instance";
import { adminFeedExecutionLogStatsService } from "./AdminFeedExecutionLogStatsService.instance";

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
}
