import { PipelineStage } from "mongoose"; // FilterQuery 제거
import { SiteLean } from "@/features/rss/site/types/leans";
import { PaginatedResponse } from "@/shared/types/pagination";
import { AdminSiteQuery } from "../types/search";
import { SiteModel } from "@/features/rss/site/model/Site";

export class AdminSiteRepository {
  async getSites(query: AdminSiteQuery): Promise<PaginatedResponse<SiteLean>> {
    const { page, limit, search, searchField, sort, sortOrder, filters } =
      query;
    const skip = (page - 1) * limit;

    // 1. 매칭 조건 생성
    // FilterQuery 대신 Mongoose 모델의 타입 정의를 활용하거나
    // MongoDB Query 형태인 Record<string, unknown>을 활용합니다.
    const matchCondition: Record<string, unknown> = {};

    if (search && search.trim().length > 0) {
      matchCondition[searchField] = { $regex: search, $options: "i" };
    }

    // 필터 매핑
    if (filters.hasFeed === "true") {
      matchCondition.feed_url = { $ne: null, $nin: [""] };
    } else if (filters.hasFeed === "false") {
      matchCondition.$or = [{ feed_url: null }, { feed_url: "" }];
    }

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

      if (start) dateQuery.$gte = start;
      if (end) dateQuery.$lte = end;

      if (Object.keys(dateQuery).length > 0) {
        matchCondition.createdAt = dateQuery;
      }
    }

    // 2. 정렬 맵 설정
    const mongoOrder = sortOrder === "asc" ? 1 : -1;
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      name: { name: mongoOrder },
      url: { url: mongoOrder },
      status: { hasFeedUrl: mongoOrder },
      createdAt: { createdAt: mongoOrder },
      updatedAt: { updatedAt: mongoOrder },
    };

    // 3. 파이프라인 구성
    const pipeline: PipelineStage[] = [
      { $match: matchCondition },
      {
        $addFields: {
          hasFeedUrl: {
            $cond: [
              {
                $and: [
                  { $ne: ["$feed_url", null] },
                  { $ne: ["$feed_url", ""] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
      { $sort: sortMap[sort] ?? sortMap.createdAt },
      { $skip: skip },
      { $limit: limit },
    ];

    const [items, totalCount] = await Promise.all([
      SiteModel.aggregate<SiteLean>(pipeline),
      SiteModel.countDocuments(matchCondition),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }
}
