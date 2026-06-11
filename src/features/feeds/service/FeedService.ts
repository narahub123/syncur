import { feedRepository } from "../repository/FeedRepository.instance";
import { Feed } from "@/shared/types/feed";
import { getFeedItems } from "./getMyFeedItems/getFeedItems";
import { FeedLean, SiteLean } from "@/shared/types/domain-leans";
import { toFeed } from "../mapper/toFeed";
import { FeedWithSiteDtoPagedResponse } from "../dto/feedDto";
import { toFeedWithSiteDto } from "../mapper/toFeedWithSiteDto";
import { ADMIN_CONFIG } from "@/features/admin/constants/admin-config";
import { PAGINATION } from "@/shared/constants/pagination";
import { AdminFeedsQuery } from "@/features/admin/feeds/types";

export class FeedService {
  async ensureFeed(site: SiteLean): Promise<Feed | null> {
    if (!site?.feed_url) return null;

    let feed = await feedRepository.findBySiteId(site._id);

    if (!feed) {
      feed = await feedRepository.create({
        siteId: site._id.toString(),
        feedUrl: site.feed_url,
        status: "active",
        errorCount: 0,
        categories: [],
      });
    }

    return toFeed(feed as FeedLean);
  }

  async getMyFeedItems(userId: string, cursor?: string) {
    return getFeedItems(userId, cursor);
  }

  /**
   * Feed 목록 조회 (페이지네이션 + 검색)
   *
   * - admin / monitoring 용
   */
  async getFeedsPaginated(
    query: AdminFeedsQuery,
  ): Promise<FeedWithSiteDtoPagedResponse> {
    const page = query.page ?? PAGINATION.DEFAULT_PAGE;
    const limit = query.limit ?? ADMIN_CONFIG.FEEDS.PAGINATION_LIMIT;

    const { items, totalCount } = await feedRepository.findAllPaginated({
      page,
      limit,
      search: query.search,
      searchField: query.searchField,
      sort: query.sort,
      sortOrder: query.sortOrder,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      items: items.map(toFeedWithSiteDto),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    };
  }
}
