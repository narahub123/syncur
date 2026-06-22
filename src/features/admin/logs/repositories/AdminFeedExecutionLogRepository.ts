import { FeedExecutionLogWithFeedAndSiteLeanPagedResponse } from "@/features/feed-execution-logs/dto/feedExecutionLogDto";
import { AdminFeedExecutionLogsQuery } from "../types/search";
import { FeedExecutionLogWithFeedAndSiteLean } from "@/features/feed-execution-logs/types/lean";
import { FeedExecutionLogModel } from "@/features/feed-execution-logs/model/feed-execution-log";
import { Types } from "mongoose";
import { toObjectId } from "@/shared/utils/toObjectId";

export default class AdminFeedExecutionLogRepository {
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
    if (
      Array.isArray(filters.status) &&
      filters.status.length > 0 &&
      !filters.status.includes("all")
    ) {
      matchStage.status = {
        $in: filters.status,
      };
    }

    /**
     * 종료 사유
     */
    if (
      Array.isArray(filters.reason) &&
      filters.reason.length > 0 &&
      !filters.reason.includes("all")
    ) {
      matchStage.reason = {
        $in: filters.reason,
      };
    }

    /**
     * 실패 단계
     */
    if (
      Array.isArray(filters.failedAtStage) &&
      filters.failedAtStage.length > 0 &&
      !filters.failedAtStage.includes("all")
    ) {
      matchStage.failedAtStage = {
        $in: filters.failedAtStage,
      };
    }

    /**
     * 에러 타입
     */
    if (
      Array.isArray(filters.errorType) &&
      filters.errorType.length > 0 &&
      !filters.errorType.includes("all")
    ) {
      matchStage["error.type"] = {
        $in: filters.errorType,
      };
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
