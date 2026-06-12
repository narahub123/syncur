import { feedRepository } from "../repository/FeedRepository.instance";
import { Feed, FeedStatus } from "@/shared/types/feed";
import { getFeedItems } from "./getMyFeedItems/getFeedItems";
import { FeedLean, SiteLean } from "@/shared/types/domain-leans";
import { toFeed } from "../mapper/toFeed";
import { FeedDto, FeedWithSiteDtoPagedResponse } from "../dto/feedDto";
import { toFeedWithSiteDto } from "../mapper/toFeedWithSiteDto";
import { ADMIN_CONFIG } from "@/features/admin/constants/admin-config";
import { PAGINATION } from "@/shared/constants/pagination";
import { AdminFeedsQuery } from "@/features/admin/feeds/types";
import { toFeedDto } from "../mapper/toFeedDto";
import { RSS_CONFIG } from "@/ingestion/rss/rss-config";

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

  async changeStatus(
    feedId: string,
    status: FeedStatus,
  ): Promise<FeedDto | null> {
    const feed = await feedRepository.updateStatus(feedId, status);

    if (!feed) {
      throw new Error("Feed not found");
    }

    return toFeedDto(feed);
  }

  async changeErrorCount(
    feedId: string,
    errorCount: number,
  ): Promise<FeedDto | null> {
    const feed = await feedRepository.updateErrorCount(feedId, errorCount);

    if (!feed) {
      throw new Error("Feed not found");
    }

    return toFeedDto(feed);
  }

  /**
   * ingestion 대상 feed 조회
   *
   * cron에서는 이 메서드만 호출한다
   * → query 조건을 cron에서 제거하기 위함
   */
  async getIngestionTargets() {
    return feedRepository.findIngestionTargets({
      errorThreshold: RSS_CONFIG.ERROR_THRESHOLD,
      fetchIntervalMs: RSS_CONFIG.FETCH_INTERVAL_MS,
    });
  }
}
