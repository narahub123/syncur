import { FeedWithSiteDto } from "@/features/feeds/dto/feedDto";
import { AdminFeedsQuery } from "../types/search";
import { PAGINATION } from "@/shared/constants/pagination";
import { ADMIN_CONFIG } from "../../constants/admin-config";
import { adminFeedRepository } from "../repositories/AdminFeedRepository.instance";
import { toFeedWithSiteDtos } from "@/features/feeds/mapper/toFeedWithSiteDto";
import { FeedStatsDto } from "@/features/feeds/dto/feedStatsDto";
import { DashboardResponse } from "../../sites/types/stats";
import { adminFeedStatsService } from "./AdminFeedStatsService.instance";

export default class AdminFeedService {
  /**
   * Feed 목록 조회 (페이지네이션 + 검색)
   *
   * - admin / monitoring 용
   */
  async getFeedsPaginated(
    query: AdminFeedsQuery,
  ): Promise<DashboardResponse<FeedWithSiteDto, FeedStatsDto>> {
    const page = query.page ?? PAGINATION.DEFAULT_PAGE;
    const limit = query.limit ?? ADMIN_CONFIG.FEEDS.PAGINATION_LIMIT;

    const [{ items, totalCount }, stats] = await Promise.all([
      adminFeedRepository.findAllPaginated({
        page,
        limit,
        search: query.search,
        searchField: query.searchField,
        sort: query.sort,
        sortOrder: query.sortOrder,
        filters: query.filters,
      }),
      adminFeedStatsService.getStats(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: toFeedWithSiteDtos(items),
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
