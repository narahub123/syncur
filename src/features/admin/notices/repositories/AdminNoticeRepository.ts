import { NoticeModel } from "@/features/support/notices/model/Notice";
import {
  NoticeAdminLeanPagedResponse,
  NoticeWithUserLean,
} from "@/features/support/notices/types/lean";
import { toObjectId } from "@/shared/utils/toObjectId";
import { Types } from "mongoose";
import { AdminNoticeQuery } from "../types/search";

export class AdminNoticeRepository {
  /**
   * 관리자 전용 공지사항 목록 조회
   * * 페이지네이션 + 동적 검색 + 작성자 어드민 JOIN
   */
  async findAllPaginatedForAdmin(
    params: AdminNoticeQuery,
  ): Promise<NoticeAdminLeanPagedResponse> {
    const {
      page,
      limit,
      search,
      searchField = "title",
      sort = "createdAt",
      sortOrder = "desc",
      filters = {},
    } = params;

    const skip = (page - 1) * limit;
    const mongoOrder = sortOrder === "asc" ? 1 : -1;

    /**
     * 정렬
     */
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      title: { title: mongoOrder },
      views: { views: mongoOrder },
      category: { category: mongoOrder },
      isPinned: { isPinned: mongoOrder },
      createdAt: { createdAt: mongoOrder },
      createdBy: { "author.name": mongoOrder },
    };

    /**
     * 검색 및 필터 조건
     */
    const matchStage: Record<string, unknown> = {};

    /**
     * 검색
     */
    if (search && search.trim().length > 0) {
      matchStage[searchField] = {
        $regex: search,
        $options: "i",
      };
    }

    /**
     * 카테고리
     */
    if (
      Array.isArray(filters.category) &&
      filters.category.length > 0 &&
      !filters.category.includes("all")
    ) {
      matchStage.category = {
        $in: filters.category,
      };
    }

    /**
     * 고정 여부
     */
    if (filters.isPinned && filters.isPinned !== "all") {
      matchStage.isPinned = filters.isPinned === "true";
    }

    /**
     * 작성일
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
     * 공통 Aggregation Pipeline
     */
    const basePipeline = [
      /**
       * 검색 및 필터
       */
      {
        $match: matchStage,
      },

      /**
       * 작성자 정보 조회
       */
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "author",
        },
      },

      /**
       * 작성자 배열 해제
       */
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const [items, countResult] = await Promise.all([
      /**
       * 목록 조회
       */
      NoticeModel.aggregate<NoticeWithUserLean>([
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
            title: 1,
            content: 1,
            category: 1,
            views: 1,
            isPinned: 1,
            createdBy: 1,
            createdAt: 1,
            updatedAt: 1,
            author: {
              _id: "$author._id",
              email: "$author.email",
              name: "$author.name",
              image: "$author.image",
              profileImage: "$author.profileImage",
            },
          },
        },
      ]),

      /**
       * 전체 개수 조회
       */
      NoticeModel.aggregate([
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

  /**
   * 관리자용 공지사항 상세 조회 (작성자 JOIN 포함)
   */
  async findDetailForAdmin(
    id: Types.ObjectId | string,
  ): Promise<NoticeWithUserLean | null> {
    const result = await NoticeModel.aggregate<NoticeWithUserLean>([
      { $match: { _id: toObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          category: 1,
          views: 1,
          isPinned: 1,
          images: 1,
          createdAt: 1,
          updatedAt: 1,
          author: {
            // 필요한 유저 정보만 추출
            _id: 1,
            name: 1,
            email: 1,
            image: 1,
            profileImage: 1,
          },
        },
      },
    ]);

    return result[0] || null;
  }
}
