import {
  RequestAdminLeanPagedResponse,
  RequestWithUserAndAdminLean,
} from "@/features/support/requests/types/admin-search";
import { InquiryQuery, InquiryStatus } from "../types/search";
import { RequestModel } from "@/features/support/requests/model/Request";
import { INQUIRY_SEARCH_FIELD } from "../types/search";
import { Types } from "mongoose";
import { toObjectId } from "@/shared/utils/toObjectId";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { RequestLean } from "@/features/support/requests/types/lean";

export class InquiryRepository {
  constructor() {}

  async findAllPaginatedForAdmin(
    params: InquiryQuery,
  ): Promise<RequestAdminLeanPagedResponse> {
    const { page, limit, search, searchField, sort, sortOrder, filters } =
      params;

    const skip = (page - 1) * limit;
    const mongoOrder = sortOrder === "asc" ? 1 : -1;

    /**
     * =========================
     * SORT MAP
     * =========================
     */
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      status: { status: mongoOrder },
      title: { title: mongoOrder },
      user: { "user.name": mongoOrder },
      createdAt: { createdAt: mongoOrder },
    };

    /**
     * =========================
     * MATCH STAGE
     * =========================
     */
    const matchStage: Record<string, unknown> = {};

    // status filter
    const statusFilter = filters?.status;

    if (Array.isArray(statusFilter)) {
      if (!statusFilter.includes("all")) {
        matchStage.status = { $in: statusFilter };
      }
    }

    /**
     * =========================
     * SEARCH
     * =========================
     */
    if (search && search.trim().length > 0) {
      const keyword = search.trim();

      switch (searchField) {
        case INQUIRY_SEARCH_FIELD.TITLE:
          matchStage.title = { $regex: keyword, $options: "i" };
          break;

        case INQUIRY_SEARCH_FIELD.CONTENT:
          matchStage.content = { $regex: keyword, $options: "i" };
          break;

        case INQUIRY_SEARCH_FIELD.USER:
          matchStage.$or = [
            { "user.name": { $regex: keyword, $options: "i" } },
            { userEmail: { $regex: keyword, $options: "i" } },
          ];
          break;
      }
    }

    /**
     * =========================
     * BASE PIPELINE
     * =========================
     */
    const basePipeline = [
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

      ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
    ];

    /**
     * =========================
     * EXECUTION
     * =========================
     */
    const [items, countResult] = await Promise.all([
      RequestModel.aggregate<RequestWithUserAndAdminLean>([
        ...basePipeline,
        { $sort: sortMap[sort] },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            userId: 1,
            userEmail: 1,
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
              image: "$user.image",
              profileImage: "$user.profileImage",
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
                  images: "$adminReply.images",
                },
                else: null,
              },
            },
          },
        },
      ]),

      RequestModel.aggregate([...basePipeline, { $count: "totalCount" }]),
    ]);

    return {
      items,
      totalCount: countResult[0]?.totalCount ?? 0,
    };
  }

  /**
   * Inquiry 상세 조회 (Admin)
   */
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
        $unwind: {
          path: "$repliedByAdmin",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          userId: 1,
          userEmail: 1,
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
            image: "$user.image",
            profileImage: "$user.profileImage",
            role: "$user.role",
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
                images: "$adminReply.images",
              },
              else: null,
            },
          },
        },
      },
    ]);

    return result[0] || null;
  }

  /**
   * Inquiry 답변 등록 + 상태 변경 (Atomic)
   */
  async submitAdminReply(params: {
    inquiryId: Types.ObjectId | string;
    replyContent: string;
    images: ImageInfo[];
    repliedBy: Types.ObjectId | string;
    status: InquiryStatus;
  }): Promise<RequestLean | null> {
    const existing = await RequestModel.findById(params.inquiryId).lean();

    if (!existing) return null;

    const newAdminReply = {
      replyContent: params.replyContent,
      images: params.images,
      repliedBy: toObjectId(params.repliedBy),
      repliedAt: existing.adminReply?.repliedAt || new Date(),
      repliedUpdatedAt: new Date(),
    };

    return RequestModel.findByIdAndUpdate(
      toObjectId(params.inquiryId),
      {
        $set: {
          status: params.status,
          adminReply: newAdminReply,
        },
      },
      { returnDocument: "after" },
    ).lean();
  }
}
