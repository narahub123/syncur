import {
  ImageInfo,
  ImageInfoSchema,
} from "@/shared/lib/cloudinary/image-info.model";
import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * Notice Document
 */
export interface NoticeDocument extends Document {
  /**
   * 공지사항 제목
   */
  title: string;

  /**
   * 공지사항 내용
   */
  content: string;

  category: "GENERAL" | "SERVICE" | "EVENT" | "MAINTENANCE";

  /**
   * 상단 고정 여부
   */
  isPinned: boolean;

  /**
   * 조회수
   */
  views: number;

  /**
   * 작성자
   */
  createdBy: Types.ObjectId;

  /**
   * 생성일시
   */
  createdAt: Date;

  /**
   * 수정일시
   */
  updatedAt: Date;
  /**
   * 이미지 배열
   */
  images: ImageInfo[];
}

/**
 * Notice Schema
 */
const NoticeSchema = new Schema<NoticeDocument>(
  {
    /**
     * 공지사항 제목
     */
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    /**
     * 공지사항 내용
     */
    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["GENERAL", "SERVICE", "EVENT", "MAINTENANCE"], // 데이터 무결성 보장
      default: "GENERAL",
    },

    /**
     * 상단 고정 여부 (목록 상단 노출용)
     */
    isPinned: {
      type: Boolean,
      default: false,
    },

    /**
     * 작성자
     */
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /**
     * 조회수
     */
    views: {
      type: Number,
      default: 0,
    },

    images: {
      type: [ImageInfoSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * 공지사항 목록 조회 인덱스
 * * 중요 공지 우선 배치 후, 최신순 정렬
 */
NoticeSchema.index({
  isPinned: -1,
  createdAt: -1,
});

export const NoticeModel =
  mongoose.models.Notice ||
  mongoose.model<NoticeDocument>("Notice", NoticeSchema);
