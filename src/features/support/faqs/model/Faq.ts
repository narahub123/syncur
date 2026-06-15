// server/models/Faq.ts
import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * Faq Document
 */
export interface FaqDocument extends Document {
  userId: Types.ObjectId;
  /**
   * FAQ 카테고리 (예: 결제, 이용문의, 버그신고 등)
   */
  category: string;

  /**
   * 질문 제목
   */
  question: string;

  /**
   * 답변 내용
   */
  answer: string;

  /**
   * 정렬 순서
   */
  sortOrder: number;

  /**
   * 생성일시
   */
  createdAt: Date;

  /**
   * 수정일시
   */
  updatedAt: Date;

  isPublished: boolean;
}

/**
 * Faq Schema
 */
const FaqSchema = new Schema<FaqDocument>(
  {
    /**
     * 작성자
     */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /**
     * FAQ 카테고리
     */
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    /**
     * 질문 제목
     */
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    /**
     * 답변 내용
     */
    answer: {
      type: String,
      required: true,
    },

    /**
     * 카테고리 내 정렬 순서 (낮은 숫자가 먼저 노출)
     */
    sortOrder: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * 카테고리별 정렬 조회 인덱스
 */
FaqSchema.index({
  category: 1,
  sortOrder: 1,
});

export const FaqModel =
  mongoose.models.Faq || mongoose.model<FaqDocument>("Faq", FaqSchema);
