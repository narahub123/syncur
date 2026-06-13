import { FeedExecutionLogModel } from "../model/feed-execution-log";
import { FeedExecutionLogWithFeedAndSiteLeanPagedResponse } from "../dto/feedExecutionLogDto";
import { AdminFeedExecutionLogsQuery } from "../types";

export class FeedExecutionLogRepository {
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
    } = params;

    const skip = (page - 1) * limit;
    const mongoOrder = sortOrder === "asc" ? 1 : -1;

    /**
     * 1. sortMap (LEGACY 제거 완료)
     */
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

    /**
     * 2. searchMap
     */
    const searchMap = {
      siteName: "site.name",
      status: "status",
      reason: "reason",
      errorType: "error.type",
    } as const;

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
    ];

    const matchStage =
      search && search.trim().length > 0
        ? {
            [searchMap[searchField]]: {
              $regex: search,
              $options: "i",
            },
          }
        : {};

    const pipelineBase = [
      ...basePipeline,
      ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
    ];

    const [items, countResult] = await Promise.all([
      FeedExecutionLogModel.aggregate([
        ...pipelineBase,
        { $sort: sortMap[sort] },
        { $skip: skip },
        { $limit: limit },

        /**
         * 3. FINAL PROJECT
         */
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
              _id: 1,
              feedUrl: 1,
              status: 1,
              siteId: 1,
            },

            site: {
              _id: 1,
              url: 1,
              name: 1,
              favicon_url: 1,
            },
          },
        },
      ]),

      FeedExecutionLogModel.aggregate([
        ...pipelineBase,
        { $count: "totalCount" },
      ]),
    ]);

    return {
      items,
      totalCount: countResult[0]?.totalCount ?? 0,
    };
  }
}
