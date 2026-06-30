import { PipelineStage } from "mongoose"; // FilterQuery 제거
import { SiteLean } from "@/features/sites/types/leans";
import { PaginatedResponse } from "@/shared/types/pagination";
import { AdminSiteQuery } from "../types/search";
import { SiteModel } from "@/features/sites/model/Site";

export class AdminSiteRepository {
  async getSites(query: AdminSiteQuery): Promise<PaginatedResponse<SiteLean>> {
    const { page, limit, search, searchField, sort, sortOrder, filters } =
      query;

    const skip = (page - 1) * limit;

    const matchCondition: Record<string, unknown> = {};

    // 검색
    if (search && search.trim().length > 0) {
      matchCondition[searchField] = { $regex: search, $options: "i" };
    }

    // feed 상태 필터 (기존 hasFeed → feedStatus 기반으로 변경)
    if (filters.feedStatus && filters.feedStatus !== "all") {
      matchCondition.feedStatus = filters.feedStatus;
    }

    // 생성일
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

    const mongoOrder = sortOrder === "asc" ? 1 : -1;

    const sortMap: Record<string, Record<string, 1 | -1>> = {
      name: { name: mongoOrder },
      url: { url: mongoOrder },
      status: { feedStatus: mongoOrder },
      createdAt: { createdAt: mongoOrder },
      updatedAt: { updatedAt: mongoOrder },
    };

    const pipeline: PipelineStage[] = [
      { $match: matchCondition },
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
