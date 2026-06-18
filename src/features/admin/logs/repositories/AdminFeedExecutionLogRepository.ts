import { FeedExecutionLogWithFeedAndSiteLeanPagedResponse } from "@/features/feed-execution-logs/dto/feedExecutionLogDto";
import { AdminFeedExecutionLogsQuery } from "../types/search";
import { FeedExecutionLogWithFeedAndSiteLean } from "@/features/feed-execution-logs/types/lean";
import { FeedExecutionLogModel } from "@/features/feed-execution-logs/model/feed-execution-log";

export default class AdminFeedExecutionLogRepository {
  async findAllPaginated(
    params: AdminFeedExecutionLogsQuery,
  ): Promise<FeedExecutionLogWithFeedAndSiteLeanPagedResponse> {
    const {
      page,
      limit,
      search,
      searchField = "siteName",
      sort = "startedAt",
      sortOrder = "desc",
      filters = {},
    } = params;

    const skip = (page - 1) * limit;
    const mongoOrder = sortOrder === "asc" ? 1 : -1;

    const sortMap = {
      siteName: { "site.name": mongoOrder },
      errorType: { "error.type": mongoOrder },
      status: { status: mongoOrder },
      reason: { reason: mongoOrder },
      startedAt: { startedAt: mongoOrder },
      finishedAt: { finishedAt: mongoOrder },
      durationMs: { durationMs: mongoOrder },
      failedAtStage: { failedAtStage: mongoOrder },
    } as const;

    const searchMap = {
      siteName: "site.name",
      status: "status",
      reason: "reason",
      errorType: "error.type",
    } as const;

    /**
     * 검색 및 필터
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
     * 실행 상태
     */
    if (filters.status && filters.status !== "all") {
      matchStage.status = filters.status;
    }

    /**
     * 종료 사유
     */
    if (filters.reason && filters.reason !== "all") {
      matchStage.reason = filters.reason;
    }

    /**
     * 실패 단계
     */
    if (filters.failedAtStage && filters.failedAtStage !== "all") {
      matchStage.failedAtStage = filters.failedAtStage;
    }

    /**
     * 에러 타입
     */
    if (filters.errorType && filters.errorType !== "all") {
      matchStage["error.type"] = filters.errorType;
    }

    /**
     * 시작일
     */
    if (
      filters.startedAt &&
      typeof filters.startedAt === "object" &&
      ("start" in filters.startedAt || "end" in filters.startedAt)
    ) {
      const { start, end } = filters.startedAt as {
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
        matchStage.startedAt = dateQuery;
      }
    }

    /**
     * 종료일
     */
    if (
      filters.finishedAt &&
      typeof filters.finishedAt === "object" &&
      ("start" in filters.finishedAt || "end" in filters.finishedAt)
    ) {
      const { start, end } = filters.finishedAt as {
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
        matchStage.finishedAt = dateQuery;
      }
    }

    const basePipeline = [
      {
        $lookup: {
          from: "feeds",
          localField: "feedId",
          foreignField: "_id",
          as: "feed",
        },
      },
      {
        $unwind: {
          path: "$feed",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "sites",
          localField: "feed.siteId",
          foreignField: "_id",
          as: "site",
        },
      },
      {
        $unwind: {
          path: "$site",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: matchStage,
      },
    ];

    const [items, countResult] = await Promise.all([
      FeedExecutionLogModel.aggregate<FeedExecutionLogWithFeedAndSiteLean>([
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
            executionId: 1,
            status: 1,
            reason: 1,
            startedAt: 1,
            finishedAt: 1,
            durationMs: 1,
            failedAtStage: 1,
            error: 1,
            createdAt: 1,
            updatedAt: 1,

            feed: {
              _id: "$feed._id",
              feedUrl: "$feed.feedUrl",
              status: "$feed.status",
              siteId: "$feed.siteId",
            },

            site: {
              _id: "$site._id",
              url: "$site.url",
              name: "$site.name",
              favicon_url: "$site.favicon_url",
            },
          },
        },
      ]),

      FeedExecutionLogModel.aggregate([
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
