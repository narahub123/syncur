import { FeedExecutionLogModel } from "../model/feed-execution-log";
import { FeedExecutionLogWithFeedAndSiteLeanPagedResponse } from "../dto/feedExecutionLogDto";
import { AdminFeedExecutionLogsQuery } from "../types";

/**
 * Admin Feed Execution Log 조회 Repository
 *
 * 특징:
 * - User / Feed repository와 동일한 pagination pattern 적용
 * - search + sort + pagination + count 동시 지원
 * - Feed + Site join 포함 (admin read model)
 */
export class FeedExecutionLogRepository {
  /**
   * 로그 목록 조회 (페이지네이션 + 검색 + 정렬)
   *
   * Admin UI 전용 API
   */
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

    const sortMap = {
      siteName: { "site.name": mongoOrder },
      errorType: { "error.type": mongoOrder },
      status: { status: mongoOrder },
      reason: { reason: mongoOrder },
      httpStatus: { httpStatus: mongoOrder },
      startedAt: { startedAt: mongoOrder },
      durationMs: { durationMs: mongoOrder },
      cacheHit: { cacheHit: mongoOrder },
      fetchedCount: { fetchedCount: mongoOrder },
      insertedCount: { insertedCount: mongoOrder },
      failedAtStage: { failedAtStage: mongoOrder },
    } as const;

    const searchMap = {
      siteName: "site.name",
      status: "status",
      reason: "reason",
      errorType: "error.type",
      httpStatus: "httpStatus",
    } as const;

    /**
     * 1. base pipeline (JOIN 먼저)
     */
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

    /**
     * 2. match stage (JOIN 이후 적용!)
     */
    const matchStage =
      search && search.trim().length > 0
        ? {
            [searchMap[searchField]]: {
              $regex: search,
              $options: "i",
            },
          }
        : {};

    /**
     * 3. pipeline (match는 lookup 이후)
     */
    const pipelineBase = [
      ...basePipeline,
      ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
    ];

    const [items, countResult] = await Promise.all([
      FeedExecutionLogModel.aggregate([
        ...pipelineBase,

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

            httpStatus: 1,
            cacheHit: 1,

            fetchedCount: 1,
            insertedCount: 1,

            error: 1,
            failedAtStage: 1,

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
