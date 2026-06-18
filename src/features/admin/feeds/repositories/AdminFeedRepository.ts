import { SortOrder } from "@/shared/types/pagination";
import {
  AdminFeedFilterKey,
  AdminFeedSearchField,
  AdminFeedSort,
} from "../types/search";
import { FilterValue } from "../../constants/filters";
import {
  FeedWithSiteLean,
  FeedWithSiteLeanPagedResponse,
} from "@/features/feeds/dto/feedDto";
import { FeedModel } from "@/features/feeds/model/feed";

export default class AdminFeedRepository {
  async findAllPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    searchField?: AdminFeedSearchField;
    sort?: AdminFeedSort;
    sortOrder?: SortOrder;
    filters?: Partial<Record<AdminFeedFilterKey, FilterValue>>;
  }): Promise<FeedWithSiteLeanPagedResponse> {
    const {
      page,
      limit,
      search,
      searchField = "siteName",
      sort = "siteName",
      sortOrder = "desc",
      filters = {},
    } = params;

    const skip = (page - 1) * limit;

    const searchMap = {
      siteName: "site.name",
      siteUrl: "site.url",
      status: "status",
      category: "categories",
    } as const;

    const mongoOrder = sortOrder === "asc" ? 1 : -1;

    const sortMap = {
      siteName: { "site.name": mongoOrder },
      feedUrl: { feedUrl: mongoOrder },
      status: { status: mongoOrder },
      errorCount: { errorCount: mongoOrder },
      lastFetchedAt: { lastFetchedAt: mongoOrder },
      createdAt: { createdAt: mongoOrder },
    } as const;

    /**
     * 검색 및 필터 조건
     */
    const matchStage: Record<string, unknown> = {};

    /**
     * 검색
     */
    if (search && search.trim().length > 0) {
      matchStage[searchMap[searchField]] = {
        $regex: search,
        $options: "i",
      };
    }

    /**
     * 상태
     */
    if (filters.status && filters.status !== "all") {
      matchStage.status = filters.status;
    }

    /**
     * 에러 횟수
     */
    if (
      Array.isArray(filters.errorCount) &&
      filters.errorCount.length > 0 &&
      !filters.errorCount.includes("all")
    ) {
      matchStage.errorCount = {
        $in: filters.errorCount.map(Number),
      };
    }

    /**
     * 생성일
     */
    if (
      filters.createdAt &&
      typeof filters.createdAt === "object" &&
      ("start" in filters.createdAt || "end" in filters.createdAt)
    ) {
      const { start, end } = filters.createdAt as {
        start: Date | null;
        end: Date | null;
      };

      const dateQuery: Record<string, Date> = {};

      if (start) {
        dateQuery.$gte = start;
      }

      if (end) {
        dateQuery.$lte = end;
      }

      if (Object.keys(dateQuery).length > 0) {
        matchStage.createdAt = dateQuery;
      }
    }

    /**
     * 마지막 수집일
     */
    if (
      filters.lastFetchedAt &&
      typeof filters.lastFetchedAt === "object" &&
      ("start" in filters.lastFetchedAt || "end" in filters.lastFetchedAt)
    ) {
      const { start, end } = filters.lastFetchedAt as {
        start: Date | null;
        end: Date | null;
      };

      const dateQuery: Record<string, Date> = {};

      if (start) {
        dateQuery.$gte = start;
      }

      if (end) {
        dateQuery.$lte = end;
      }

      if (Object.keys(dateQuery).length > 0) {
        matchStage.lastFetchedAt = dateQuery;
      }
    }

    const basePipeline = [
      {
        $lookup: {
          from: "sites",
          localField: "siteId",
          foreignField: "_id",
          as: "site",
        },
      },
      {
        $unwind: "$site",
      },
      {
        $match: matchStage,
      },
    ];

    const [items, countResult] = await Promise.all([
      FeedModel.aggregate<FeedWithSiteLean>([
        ...basePipeline,
        {
          $sort: sortMap[sort],
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $project: {
            _id: 1,
            feedUrl: 1,
            status: 1,
            lastFetchedAt: 1,
            etag: 1,
            lastModified: 1,
            errorCount: 1,
            categories: 1,
            createdAt: 1,
            updatedAt: 1,
            siteId: {
              _id: "$site._id",
              name: "$site.name",
              url: "$site.url",
              favicon_url: "$site.favicon_url",
              feed_url: "$site.feed_url",
            },
          },
        },
      ]),

      FeedModel.aggregate([
        ...basePipeline,
        {
          $count: "totalCount",
        },
      ]),
    ]);

    return {
      items,
      totalCount: countResult[0]?.totalCount ?? 0,
    };
  }
}
