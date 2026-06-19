import {
  FaqLean,
  FaqWithUserLean,
  FaqWithUserLeanPagedResponse,
} from "@/features/support/faqs/types/lean";
import { AdminFaqsQuery } from "../types/search";
import { FaqModel } from "@/features/support/faqs/model/Faq";
import { FaqStatsDto } from "../types/stats";
import { Types } from "mongoose";
import { CreateFaqDto, UpdateFaqDto } from "@/features/support/faqs/dtos";
import { toObjectId } from "@/shared/utils/toObjectId";

export class AdminFaqRepository {
  /**
   * FAQ 생성 (어드민 전용)
   * * @param dto 생성할 FAQ 데이터 규격 (카테고리, 질문, 답변, 정렬 순서 등)
   * @returns Mongoose 도큐먼트가 Plain Object로 변환된 FAQ Lean 객체
   */
  async create(
    userId: string | Types.ObjectId,
    dto: CreateFaqDto,
  ): Promise<FaqLean> {
    const faq = await FaqModel.create({
      ...dto,
      userId: toObjectId(userId),
    });
    return faq.toObject();
  }

  /**
   * 단일 FAQ 조회
   * * @param id 조회할 FAQ의 고유 ID (Types.ObjectId 또는 문자열)
   * @returns 검색된 FAQ Lean 객체 (존재하지 않을 경우 null)
   */
  async findById(id: Types.ObjectId | string): Promise<FaqLean | null> {
    return FaqModel.findById(toObjectId(id)).lean();
  }

  /**
   * FAQ 수정 (어드민 전용)
   * * @param id 수정할 FAQ의 고유 ID
   * @param dto 업데이트할 FAQ 데이터 필드 집합 ($set 원자적 반영)
   * @returns 수정이 완료된 이후의 FAQ Lean 객체 (존재하지 않을 경우 null)
   */
  async update(
    id: Types.ObjectId | string,
    dto: UpdateFaqDto,
  ): Promise<FaqLean | null> {
    return FaqModel.findByIdAndUpdate(
      toObjectId(id),
      { $set: dto },
      { returnDocument: "after" },
    ).lean();
  }

  /**
   * FAQ 삭제 (어드민 전용)
   * * @param id 삭제할 FAQ의 고유 ID
   * @returns 실제 도큐먼트가 삭제되었는지 여부 (true: 삭제 성공, false: 대상 없음)
   */
  async deleteById(id: Types.ObjectId | string): Promise<boolean> {
    const result = await FaqModel.deleteOne({ _id: toObjectId(id) });
    return result.deletedCount > 0;
  }

  async findAllPaginated(
    query: AdminFaqsQuery,
  ): Promise<FaqWithUserLeanPagedResponse & { stats: FaqStatsDto }> {
    const {
      page,
      limit,
      search,
      sort = "createdAt",
      sortOrder = "desc",
      filters = {},
    } = query;

    const skip = (page - 1) * limit;
    const mongoOrder = sortOrder === "asc" ? 1 : -1;

    /**
     * 검색 및 필터 조건
     */
    const matchStage: Record<string, unknown> = {};

    /**
     * 검색
     */
    if (search && search.trim().length > 0) {
      matchStage.question = {
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
     * 공개 여부
     */
    if (filters.isPublished && filters.isPublished !== "all") {
      matchStage.isPublished = filters.isPublished === "true";
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
     * 정렬
     */
    const sortMap = {
      question: { question: mongoOrder },
      category: { category: mongoOrder },
      isPublished: { isPublished: mongoOrder },
      sortOrder: { sortOrder: mongoOrder },
      createdAt: { createdAt: mongoOrder },
    } as const;

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
          localField: "userId",
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

    const [items, countResult, stats] = await Promise.all([
      /**
       * 목록 조회
       */
      FaqModel.aggregate<FaqWithUserLean>([
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
      ]),

      /**
       * 전체 개수 조회
       */
      FaqModel.aggregate([
        ...basePipeline,
        {
          $count: "totalCount",
        },
      ]),
      FaqModel.aggregate([
        {
          $group: {
            _id: null,
            totalCount: { $sum: 1 },

            publishedCount: {
              $sum: {
                $cond: ["$isPublished", 1, 0],
              },
            },

            hiddenCount: {
              $sum: {
                $cond: ["$isPublished", 0, 1],
              },
            },

            paymentCount: {
              $sum: {
                $cond: [{ $eq: ["$category", "payment"] }, 1, 0],
              },
            },

            usageCount: {
              $sum: {
                $cond: [{ $eq: ["$category", "usage"] }, 1, 0],
              },
            },

            bugCount: {
              $sum: {
                $cond: [{ $eq: ["$category", "bug"] }, 1, 0],
              },
            },

            etcCount: {
              $sum: {
                $cond: [{ $eq: ["$category", "etc"] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

    return {
      items,
      stats: stats[0],
      totalCount: countResult[0]?.totalCount ?? 0,
    };
  }
}
