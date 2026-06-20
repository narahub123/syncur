import { NoticeModel } from "@/features/support/notices/model/Notice";
import {
  NoticeAdminLeanPagedResponse,
  NoticeLean,
  NoticeWithUserLean,
} from "@/features/support/notices/types/lean";
import { toObjectId } from "@/shared/utils/toObjectId";
import { Types } from "mongoose";
import { AdminNoticeQuery, NOTICE_STATUS } from "../types/search";
import {
  CreateNoticeDto,
  UpdateNoticeDto,
} from "@/features/support/notices/dtos/noticeDto";
import { NoticeStatsDto } from "@/features/admin/notices/dto/noticeStatsDto";
import { defaultNoticeStats } from "../constants/stats";

export class AdminNoticeRepository {
  /**
   * 공지사항 생성 (어드민 전용)
   * * @param dto 생성할 공지사항 데이터와 작성자(createdBy)의 ObjectId 결합 객체
   * @returns Mongoose 도큐먼트가 Plain Object로 변환된 공지사항 Lean 객체
   */
  async create(
    dto: CreateNoticeDto & { createdBy: Types.ObjectId },
  ): Promise<NoticeLean> {
    const notice = await NoticeModel.create(dto);
    return notice.toObject();
  }

  /**
   * 공지사항 수정 (어드민 전용)
   * * @param id 수정할 공지사항의 고유 ID
   * @param dto 업데이트할 공지사항 데이터 필드 집합 ($set 원자적 반영)
   * @returns 수정이 완료된 이후의 공지사항 Lean 객체 (존재하지 않을 경우 null)
   */
  async update(
    id: Types.ObjectId | string,
    dto: UpdateNoticeDto,
  ): Promise<NoticeLean | null> {
    return NoticeModel.findByIdAndUpdate(
      toObjectId(id),
      { $set: dto },
      { returnDocument: "after" },
    ).lean();
  }

  /**
   * 공지사항 삭제 (어드민 전용)
   * * @param id 삭제할 공지사항의 고유 ID
   * @returns 실제 도큐먼트가 삭제되었는지 여부 (true: 삭제 성공, false: 대상 없음)
   */
  async deleteById(id: Types.ObjectId | string): Promise<boolean> {
    const result = await NoticeModel.deleteOne({ _id: toObjectId(id) });
    return result.deletedCount > 0;
  }

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
      status: { status: mongoOrder },
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
     * 상태 필터 적용
     */
    if (filters.status && filters.status !== "all") {
      // filters.status 자체가 "ACTIVE" 또는 "INACTIVE" 문자열입니다.
      matchStage.status = filters.status;
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

    const [items, countResult, statsResult] = await Promise.all([
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
            status: 1,
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

      // 운영 통계
      NoticeModel.aggregate<NoticeStatsDto>([
        {
          $group: {
            _id: null,

            totalCount: {
              $sum: 1,
            },

            activeCount: {
              $sum: {
                $cond: [{ $eq: ["$status", NOTICE_STATUS.ACTIVE] }, 1, 0],
              },
            },

            inactiveCount: {
              $sum: {
                $cond: [{ $eq: ["$status", NOTICE_STATUS.INACTIVE] }, 1, 0],
              },
            },

            pinnedCount: {
              $sum: {
                $cond: ["$isPinned", 1, 0],
              },
            },
          },
        },

        {
          $project: {
            _id: 0,
            totalCount: 1,
            activeCount: 1,
            inactiveCount: 1,
            pinnedCount: 1,
          },
        },
      ]),
    ]);

    return {
      items,
      totalCount: countResult[0]?.totalCount ?? 0,
      stats: statsResult[0] ?? defaultNoticeStats,
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
          status: 1,
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
