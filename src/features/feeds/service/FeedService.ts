import { feedRepository } from "../repository/FeedRepository.instance";
import { Feed, FeedStatus } from "@/shared/types/feed";
import { getFeedItems } from "./getMyFeedItems/getFeedItems";
import { toFeed } from "../mapper/toFeed";
import { FeedDto, FeedWithSiteDtoPagedResponse } from "../dto/feedDto";
import { toFeedWithSiteDto } from "../mapper/toFeedWithSiteDto";
import { ADMIN_CONFIG } from "@/features/admin/constants/admin-config";
import { PAGINATION } from "@/shared/constants/pagination";
import { AdminFeedsQuery } from "@/features/admin/feeds/types/search";
import { toFeedDto } from "../mapper/toFeedDto";
import { RSS_CONFIG } from "@/ingestion/rss/rss-config";
import { SiteLean } from "@/features/rss/site/types/leans";
import { adminFeedStatsService } from "@/features/admin/feeds/services/AdminFeedStatsService.instance";
import { feedStatsService } from "./FeedStatService.instance";
import { FEED_STATUS } from "../constants/feed-status";
import { FeedLean } from "../types/leans";

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

    await adminFeedStatsService.updateStats({
      total: 1,
      active: 1,
    });

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
    const currentFeed = await feedRepository.findById(feedId);

    if (!currentFeed) {
      throw new Error("Feed not found");
    }

    if (currentFeed.status !== status) {
      if (status === FEED_STATUS.ACTIVE) {
        await feedStatsService.updateStats({
          active: 1,
          inactive: -1,
        });
      } else {
        await feedStatsService.updateStats({
          active: -1,
          inactive: 1,
        });
      }
    }

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

  /**
   * 구독 발생 시: 피드 카운트 증가
   */
  async incrementSubscriberCount(feedId: string): Promise<FeedDto> {
    const doc = await feedRepository.incrementSubscriberCount(feedId);
    return toFeedDto(doc);
  }

  /**
   * 구독 해지 시: 피드 카운트 감소
   */
  async decrementSubscriberCount(feedId: string): Promise<FeedDto> {
    const doc = await feedRepository.decrementSubscriberCount(feedId);
    return toFeedDto(doc);
  }
}
