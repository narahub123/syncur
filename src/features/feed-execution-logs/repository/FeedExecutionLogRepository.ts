import { FeedExecutionLogModel } from "../model/feed-execution-log";
import { FeedExecutionLogWithFeedAndSiteLeanPagedResponse } from "../dto/feedExecutionLogDto";
import { AdminFeedExecutionLogsQuery } from "../types";
import { Types } from "mongoose";
import { toObjectId } from "@/shared/utils/toObjectId";
import { FeedExecutionLogWithFeedAndSiteLean } from "../types/lean";

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

  async findOneById(
    id: string | Types.ObjectId,
  ): Promise<FeedExecutionLogWithFeedAndSiteLean | null> {
    const objectId = toObjectId(id);

    /**
     * 1. 기존 findAllPaginated의 핵심 조인 파이프라인 재사용
     * - FeedExecutionLog -> Feed -> Site로 이어지는 관계성을 완벽히 유지
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
     * 2. 상세 페이지 단건 전용 최종 파이프라인 조립
     */
    const [result] =
      await FeedExecutionLogModel.aggregate<FeedExecutionLogWithFeedAndSiteLean>(
        [
          // A. 시작점: 요청된 단건 로그 ID 필터링
          {
            $match: { _id: objectId },
          },

          // B. 공통 조인 레이어 주입
          ...basePipeline,

          // C. 기존 목록과 100% 동일한 FINAL PROJECT 규격 재사용 (데이터 싱크 보장)
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
        ],
      );

    return result ?? null;
  }
}
