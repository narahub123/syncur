import { feedRepository } from "../repository/FeedRepository.instance";
import { FeedStatus } from "@/shared/types/feed";
import { getFeedItems } from "./getMyFeedItems/getFeedItems";
import { FeedDto, FeedWithSiteDtoPagedResponse } from "../dto/feedDto";
import { toFeedWithSiteDto } from "../mapper/toFeedWithSiteDto";
import { ADMIN_CONFIG } from "@/features/admin/constants/admin-config";
import { PAGINATION } from "@/shared/constants/pagination";
import { AdminFeedsQuery } from "@/features/admin/feeds/types/search";
import { toFeedDto, toFeedDtos } from "../mapper/toFeedDto";
import { RSS_CONFIG } from "@/features/ingestion/lib/rss/rss-config";
import { feedStatsService } from "./FeedStatService.instance";
import { FEED_STATUS } from "../constants/feed-status";
import { Types } from "mongoose";
import {
  DetailPageConfig,
  ListingPageConfig,
} from "@/features/ingestion/lib/discover/types";
import { ListingPageDto } from "@/features/subscriptions/components/CrawlDialog";
import { subscriptionRepository } from "@/features/subscriptions/repository/SubscriptionRepository.instance";
import { HtmlSiteType } from "@/features/ingestion/lib/detectors/types";

export class FeedService {
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

  async createRssFeed(
    siteId: string | Types.ObjectId,
    feedUrl: string,
    name: string,
  ): Promise<FeedDto | null> {
    const uniqueKey = `rss:${feedUrl}`;

    const doc = await feedRepository.create({
      siteId,
      uniqueKey,
      sourceType: "rss",
      name,
      feedUrl,
      listingPageUrl: null,
      listingPageConfig: null,
      detailPageConfig: null,
    });

    if (!doc) return null;

    await feedStatsService.updateStats({ total: 1, active: 1 });
    return toFeedDto(doc);
  }

  async createCrawlFeed(
    siteId: string | Types.ObjectId,
    name: string,
    listingPageUrl: string,
    listingPageConfig: ListingPageConfig,
    detailPageConfig: DetailPageConfig | null,
    htmlType: HtmlSiteType,
  ): Promise<FeedDto | null> {
    const uniqueKey = `crawl:${listingPageUrl}`;

    const doc = await feedRepository.create({
      siteId,
      uniqueKey,
      sourceType: "crawl",
      name,
      feedUrl: null,
      listingPageUrl,
      listingPageConfig,
      detailPageConfig,
      crawlerConfig: {
        htmlType,
      },
    });

    if (!doc) return null;

    await feedStatsService.updateStats({ total: 1, active: 1 });
    return toFeedDto(doc);
  }

  // RSS — 사이트당 1개
  async findRssFeedBySiteId(
    siteId: string | Types.ObjectId,
  ): Promise<FeedDto | null> {
    const feeds = await feedRepository.findBySiteId(siteId);
    const feed = feeds.find((f) => f.sourceType === "rss");

    if (!feed) return null;

    return toFeedDto(feed);
  }

  // 크롤링 — 사이트당 여러 개
  async findCrawlFeedsBySiteId(
    siteId: string | Types.ObjectId,
  ): Promise<FeedDto[]> {
    const feeds = await feedRepository.findBySiteId(siteId);
    return toFeedDtos(feeds.filter((f) => f.sourceType === "crawl"));
  }

  async findBySiteId(siteId: string | Types.ObjectId): Promise<FeedDto[]> {
    const docs = await feedRepository.findBySiteId(siteId);
    return toFeedDtos(docs);
  }

  async getListingPages(
    siteId: string,
    userId: string,
  ): Promise<ListingPageDto[]> {
    if (!siteId) return [];

    // =========================
    // 1. feeds 조회
    // =========================
    const feeds = await feedRepository.findBySiteId(siteId);

    // =========================
    // 2. crawl feeds만 필터링
    // =========================
    const crawlFeeds = feeds.filter((f) => f.sourceType === "crawl");

    if (crawlFeeds.length === 0) return [];

    // =========================
    // 3. subscription 조회
    // =========================
    const subscriptions = await subscriptionRepository.findByUserId(userId);

    const subscribedSet = new Set(
      subscriptions.map((s) => s.feedId.toString()),
    );

    // =========================
    // 4. DTO 반환
    // =========================
    return crawlFeeds.map((feed) => ({
      feedId: feed._id.toString(),
      title: feed.name,
      url: feed.listingPageUrl ?? "",
      isSubscribed: subscribedSet.has(feed._id.toString()),
    }));
  }
}
