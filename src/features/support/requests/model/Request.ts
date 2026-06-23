// server/models/Request.ts
import mongoose, { Schema, Types, Document } from "mongoose";
import {
  REQUEST_STATUS,
  REQUEST_TYPE,
  RequestStatus,
  RequestType,
} from "../constants/request-type";
import { RequestAdminReplyLean, RequestMetadata } from "../types/lean";
import { ImageInfoSchema } from "@/shared/lib/cloudinary/image-info.model";
import { AdminDashboardStatsModel } from "@/features/admin/dashboard/model/AdminDashboardStats";

/**
 * Request Document
 */
export interface RequestDocument extends Document {
  /**
   * 요청 작성 사용자 ID
   */
  userId: Types.ObjectId;

  /**
   * 사용자 이메일
   */
  userEmail: string;

  /**
   * 요청 유형 (일반 문의 혹은 버그 제보)
   */
  type: RequestType;

  /**
   * 요청 제목
   */
  title: string;

  /**
   * 요청 본문 내용
   */
  content: string;

  /**
   * 처리 상태
   */
  status: RequestStatus;

  /**
   * BUG 유형일 때만 바인딩되는 가변 메타데이터
   */
  metadata?: RequestMetadata;

  /**
   * 관리자 답변 정보 (종속 임베디드 데이터)
   */
  adminReply?: RequestAdminReplyLean | null;

  /**
   * 생성일시
   */
  createdAt: Date;

  /**
   * 수정일시
   */
  updatedAt: Date;
}

/**
 * Request Schema
 */
const RequestSchema = new Schema<RequestDocument>(
  {
    /**
     * 요청 작성 사용자
     */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /**
     * 사용자 이메일 (빠른 확인용 식별 필드)
     */
    userEmail: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * 요청 유형
     */
    type: {
      type: String,
      enum: Object.values(REQUEST_TYPE),
      required: true,
    },

    /**
     * 요청 제목
     */
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    /**
     * 요청 본문 내용
     */
    content: {
      type: String,
      required: true,
    },

    /**
     * 처리 상태
     */
    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS),
      default: REQUEST_STATUS.PENDING,
    },

    /**
     * 버그 제보 시 확장 환경 정보 메타데이터
     */
    metadata: {
      category: {
        type: String,
        required: true,
        trim: true,
      },
      os: { type: String, trim: true },
      browser: { type: String, trim: true },
      images: {
        type: [ImageInfoSchema],
        default: [],
      },
    },

    /**
     * 관리자 답변 영역 (답변 완료 시 활성화)
     */
    adminReply: {
      type: {
        replyContent: { type: String, required: true },
        repliedAt: { type: Date, default: Date.now },
        repliedUpdatedAt: { type: Date, default: Date.now },
        repliedBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        images: {
          type: [ImageInfoSchema],
          default: [],
        },
      },
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * 유저 본인의 마이페이지 요청 내역 최신순 조회 인덱스
 */
RequestSchema.index({
  userId: 1,
  createdAt: -1,
});

/**
 * 어드민 전용 필터링 및 정렬 복합 인덱스 (유형별, 상태별 대응)
 */
RequestSchema.index({
  type: 1,
  status: 1,
  createdAt: -1,
});

/**
 * 💡 Request 상태 변경 시 대시보드 통계 동기화
 */
RequestSchema.post("save", async function (doc) {
  await updateRequestStats(doc.constructor as mongoose.Model<RequestDocument>);
});

RequestSchema.post("findOneAndUpdate", async function () {
  await updateRequestStats(this.model);
});

/**
 * 대시보드 CS 통계 업데이트 로직
 */
async function updateRequestStats(model: mongoose.Model<RequestDocument>) {
  try {
    const stats = await model.aggregate([
      {
        $group: {
          _id: { type: "$type", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    // stats 결과를 토대로 updateOne 수행
    // 예: { type: 'BUG', status: 'PENDING' } -> cs.bugReports.pending 카운트 갱신
    const updatePayload: Record<string, number> = {};

    stats.forEach((item) => {
      const type = item._id.type.toLowerCase(); // 'bug', 'inquiry'
      const status = item._id.status.toLowerCase(); // 'pending', 'resolved', ...
      updatePayload[`cs.${type}s.${status}`] = item.count;
    });

    await AdminDashboardStatsModel.updateOne(
      { key: "dashboard_overview" },
      { $set: updatePayload },
      { upsert: true },
    );
  } catch (error) {
    console.error("대시보드 CS 통계 동기화 실패:", error);
  }
}

export const RequestModel =
  mongoose.models.Request ||
  mongoose.model<RequestDocument>("Request", RequestSchema);
