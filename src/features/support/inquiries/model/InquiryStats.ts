import mongoose, { Schema, Document } from "mongoose";

// 대시보드 통계용 고유 키 상수 (상수 파일이 따로 있다면 그리로 이동하셔도 좋습니다)
export const INQUIRY_STATS_KEY = "inquiry_overview" as const;

/**
 * Inquiry 통계 도큐먼트 인터페이스
 */
export interface InquiryStatsDocument extends Document {
  key: string; // 고유 키 (예: "inquiry_overview")
  total: number; // 총 문의 개수
  pending: number; // 대기중 개수 (PENDING)
  processing: number; // 처리중 개수 (PROCESSING)
  completed: number; // 답변완료 개수 (COMPLETED)
  updatedAt: Date;
}

/**
 * Inquiry 통계 스키마
 */
const InquiryStatsSchema = new Schema<InquiryStatsDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: INQUIRY_STATS_KEY,
    },
    total: { type: Number, required: true, default: 0 },
    pending: { type: Number, required: true, default: 0 },
    processing: { type: Number, required: true, default: 0 },
    completed: { type: Number, required: true, default: 0 },
  },
  {
    // 동일하게 생성일(createdAt)은 제외하고 수정일(updatedAt)만 기록
    timestamps: { createdAt: false, updatedAt: true },
    versionKey: false,
  },
);

export const InquiryStatsModel =
  mongoose.models.InquiryStats ||
  mongoose.model<InquiryStatsDocument>("InquiryStats", InquiryStatsSchema);
