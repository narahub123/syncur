import { Types } from "mongoose";
import { RequestModel } from "../model/Request";
import { RequestLean } from "../types/lean";
import { RequestStatus } from "../constants/request-type";
import { toObjectId } from "@/shared/utils/toObjectId";
import { CreateRequestDto } from "../dtos";
import {
  AdminRequestQuery,
  RequestAdminLeanPagedResponse,
  RequestWithUserAndAdminLean,
} from "../types/admin-search";
import { UserRequestQuery } from "../../notices/types/user-search";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";

/**
 * Request Repository
 * * 유저의 1:1 문의 및 버그 제보(Request) 컬렉션에 대한 직접적인 CRUD 연산을 담당하며,
 * 관리자 답변(adminReply) 서브 도큐먼트 제어 및 원자적 상태 관리를 캡슐화합니다.
 */
export class RequestRepository {
  /**
   * 유저 문의 및 버그 제보 생성 (초기 status 주입)
   * * @param dto 생성할 제보 본문, 가변 메타데이터(다중 images 배열 포함) 및 식별 정보 결합 객체
   * @returns Mongoose 도큐먼트가 Plain Object로 변환된 제보 내역 Lean 객체
   */
  async create(
    dto: CreateRequestDto & {
      userId: Types.ObjectId | string;
      userEmail: string;
      status: RequestStatus;
    },
  ): Promise<RequestLean> {
    const request = await RequestModel.create(dto);
    return request.toObject();
  }

  /**
   * 유저 본인의 1:1 제보 내역 리스트 최신순 조회
   * * @param userId 내역을 조회할 해당 유저의 고유 ID
   * @returns 해당 유저가 접수한 제보 내역들의 최신 등록순(createdAt: 내림차순) Lean 객체 배열
   */
  async findByUserId(userId: Types.ObjectId | string): Promise<RequestLean[]> {
    return RequestModel.find({ userId: toObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * 단일 문의 건 상세 조회 (권한 검증용 혹은 어드민용)
   * * @param id 조회하고자 하는 문의 건의 고유 ID
   * @returns 검색된 제보 상세 Lean 객체 (존재하지 않을 경우 null)
   */
  async findById(id: Types.ObjectId | string): Promise<RequestLean | null> {
    return RequestModel.findById(toObjectId(id)).lean();
  }

  /**
   * 관리자 답변 최초 등록 및 제보 상태 변경 (Atomic 연산)
   * * @description 제보의 상태(status)를 전환하고, adminReply 객체를 통째로 새로 빌드하여
   * 최초 답변 타임스탬프(repliedAt)와 수정 타임스탬프(repliedUpdatedAt)를 동일 시점으로 동기화합니다.
   * * @param params 문의 ID, 답변 내용, 답변자 ID, 변경할 상위 도메인 상태값(status)을 포함한 매개변수
   * @returns 갱신이 완료된 이후의 제보 상세 Lean 객체 (존재하지 않을 경우 null)
   */
  async submitAdminReply(params: {
    requestId: Types.ObjectId | string;
    replyContent: string;
    images: ImageInfo[];
    repliedBy: Types.ObjectId | string;
    status: RequestStatus;
  }): Promise<RequestLean | null> {
    // 1. 기존 데이터 조회 (기존 repliedAt을 가져오기 위함)
    const existingRequest = await RequestModel.findById(
      params.requestId,
    ).lean();

    if (!existingRequest) return null;

    // 2. 답변 정보 구성 (수정 시 repliedAt은 유지, repliedUpdatedAt만 갱신)
    const newAdminReply = {
      replyContent: params.replyContent,
      images: params.images,
      repliedBy: toObjectId(params.repliedBy),
      repliedAt: existingRequest.adminReply?.repliedAt || new Date(), // 기존 값이 있으면 유지
      repliedUpdatedAt: new Date(), // 현재 시간으로 갱신
    };

    // 3. 업데이트 수행
    return RequestModel.findByIdAndUpdate(
      toObjectId(params.requestId),
      {
        $set: {
          status: params.status,
          adminReply: newAdminReply,
        },
      },
      { returnDocument: "after" },
    ).lean();
  }

  /**
   * 관리자 기존 답변 수정 (repliedUpdatedAt 타임스탬프만 단독 업데이트)
   * * @description 최초 답변 등록 시간(repliedAt)은 그대로 보존한 채,
   * 점 표기법(Dot Notation)을 활용해 답변 본문과 최종 수정 시간(repliedUpdatedAt) 필드만 원자적으로 타겟 갱신합니다.
   * * @param params 수정을 가할 문의 고유 ID 및 변경할 새로운 답변 내용
   * @returns 수정이 완료된 이후의 제보 상세 Lean 객체 (존재하지 않을 경우 null)
   */
  async updateAdminReply(params: {
    requestId: Types.ObjectId | string;
    replyContent: string;
  }): Promise<RequestLean | null> {
    return RequestModel.findByIdAndUpdate(
      toObjectId(params.requestId),
      {
        $set: {
          "adminReply.replyContent": params.replyContent,
          "adminReply.repliedUpdatedAt": new Date(), // 💡 아키텍처 규칙: 최종 수정 시간만 단독 갱신 반영
        },
      },
      { returnDocument: "after" },
    ).lean();
  }

  /**
   * 관리자 전용 1:1 제보 목록 조회
   * * 페이지네이션 + 동적 검색 + 더블 조인(작성자 & 답변 어드민)
   */
  async findAllPaginatedForAdmin(
    params: AdminRequestQuery,
  ): Promise<RequestAdminLeanPagedResponse> {
    const {
      page,
      limit,
      search,
      searchField = "title",
      sort = "createdAt",
      sortOrder = "desc",
      type,
      status,
    } = params;

    const skip = (page - 1) * limit;
    const mongoOrder = sortOrder === "asc" ? 1 : -1;

    // 💡 정렬 단언 에러를 any 대신 표준 [key: string]: 1 | -1 규격으로 원천 방어
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      title: { title: mongoOrder },
      type: { type: mongoOrder },
      status: { status: mongoOrder },
      createdAt: { createdAt: mongoOrder },
    };

    const matchStage: Record<string, unknown> = {};
    if (type) matchStage.type = type;
    if (status) matchStage.status = status;
    if (search && search.trim().length > 0) {
      matchStage[searchField] = { $regex: search, $options: "i" };
    }

    const basePipeline = [
      ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "adminReply.repliedBy",
          foreignField: "_id",
          as: "repliedByAdmin",
        },
      },
      {
        $unwind: { path: "$repliedByAdmin", preserveNullAndEmptyArrays: true },
      },
    ];

    const [items, countResult] = await Promise.all([
      RequestModel.aggregate<RequestWithUserAndAdminLean>([
        ...basePipeline,
        { $sort: sortMap[sort] }, // 💡 any 없이 통과
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            userId: 1,
            userEmail: 1,
            type: 1,
            title: 1,
            content: 1,
            status: 1,
            metadata: 1,
            createdAt: 1,
            updatedAt: 1,
            user: {
              _id: "$user._id",
              email: "$user.email",
              name: "$user.name",
            },
            adminReply: {
              $cond: {
                if: { $gt: ["$adminReply", null] },
                then: {
                  replyContent: "$adminReply.replyContent",
                  repliedAt: "$adminReply.repliedAt",
                  repliedUpdatedAt: "$adminReply.repliedUpdatedAt",
                  repliedByAdmin: {
                    _id: "$repliedByAdmin._id",
                    email: "$repliedByAdmin.email",
                    name: "$repliedByAdmin.name",
                  },
                },
                else: null,
              },
            },
          },
        },
      ]),
      RequestModel.aggregate([...basePipeline, { $count: "totalCount" }]),
    ]);

    return { items, totalCount: countResult[0]?.totalCount ?? 0 };
  }

  /**
   * 유저 본인의 1:1 제보 내역 조회 (페이지네이션 + 검색 + 상태 필터링)
   */
  async findAndCountForUser(
    userId: string,
    params: UserRequestQuery,
  ): Promise<{ items: RequestLean[]; totalCount: number }> {
    const {
      page,
      limit,
      search,
      searchField = "title",
      sort = "createdAt",
      sortOrder = "desc",
      type,
      status,
    } = params;
    const skip = (page - 1) * limit;
    const mongoOrder = sortOrder === "asc" ? 1 : -1;

    const query: Record<string, unknown> = { userId: toObjectId(userId) };
    if (type) query.type = type;
    if (status) query.status = status;
    if (search && search.trim().length > 0) {
      query[searchField] = { $regex: search, $options: "i" };
    }

    // 💡 Mongoose 내장 모델 정렬 가이드와 호환되는 리터럴 레코드 타입 선언
    const userSortCondition: Record<string, 1 | -1> = {
      [sort]: mongoOrder,
    };

    const [items, totalCount] = await Promise.all([
      RequestModel.find(query)
        .sort(userSortCondition) // 💡 any 없이 통과
        .skip(skip)
        .limit(limit)
        .lean(),
      RequestModel.countDocuments(query),
    ]);

    return { items, totalCount };
  }

  async countByStatus(status: RequestStatus): Promise<number> {
    return RequestModel.countDocuments({ status });
  }

  async countByUserIdAndStatus(
    userId: string,
    status: RequestStatus,
  ): Promise<number> {
    return RequestModel.countDocuments({ userId: toObjectId(userId), status });
  }

  async findByIdForAdmin(
    id: Types.ObjectId | string,
  ): Promise<RequestWithUserAndAdminLean | null> {
    const result = await RequestModel.aggregate<RequestWithUserAndAdminLean>([
      { $match: { _id: toObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "adminReply.repliedBy",
          foreignField: "_id",
          as: "repliedByAdmin",
        },
      },
      {
        $unwind: { path: "$repliedByAdmin", preserveNullAndEmptyArrays: true },
      },
      // ... 이후 $project 단계에서 데이터 구조 정리 (findAllPaginatedForAdmin과 동일하게)
    ]);

    return result[0] || null;
  }

  /**
   * 유저 작성 글 수정 (제목, 본문, 메타데이터 업데이트)
   * * @description 사용자가 자신의 문의/버그 제보 글을 수정할 때 사용합니다.
   * * @param params 수정할 제보 ID, 새로운 제목, 본문, 그리고 가변 메타데이터
   * * @returns 수정이 완료된 이후의 제보 상세 Lean 객체 (존재하지 않을 경우 null)
   */
  async updateUserRequest(params: {
    requestId: Types.ObjectId | string;
    title: string;
    content: string;
    metadata: {
      category: string;
      os?: string;
      browser?: string;
      images: ImageInfo[];
    };
  }): Promise<RequestLean | null> {
    console.log("이미지", params.metadata.images);

    return RequestModel.findByIdAndUpdate(
      toObjectId(params.requestId),
      {
        $set: {
          title: params.title,
          content: params.content,
          "metadata.category": params.metadata.category,
          "metadata.images": params.metadata.images,
          ...(params.metadata.os && { "metadata.os": params.metadata.os }),
          ...(params.metadata.browser && {
            "metadata.browser": params.metadata.browser,
          }),
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    ).lean();
  }
}
