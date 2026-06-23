import mongoose, { Schema, Document } from "mongoose";
import { BUG_REPORT_STATS_KEY } from "../constants/stats";

/**
 * Bug Report 통계 도큐먼트 인터페이스
 */
export interface BugReportStatsDocument extends Document {
  key: string; // 고유 키 (예: "bug_report_overview")
  total: number; // 총 버그 신고 개수
  completed: number; // 해결 완료 개수 (COMPLETED)
  pending: number; // 접수 대기 개수 (PENDING)
  checking: number; // [세분화 데이터] 확인 중 개수
  fixing: number; // [세분화 데이터] 수정 중 개수
  updatedAt: Date;
}

/**
 * Bug Report 통계 스키마
 */
const BugReportStatsSchema = new Schema<BugReportStatsDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: BUG_REPORT_STATS_KEY,
    },
    total: { type: Number, required: true, default: 0 },
    completed: { type: Number, required: true, default: 0 },
    pending: { type: Number, required: true, default: 0 },
    checking: { type: Number, required: true, default: 0 },
    fixing: { type: Number, required: true, default: 0 },
  },
  {
    // 통계 데이터이므로 생성일(createdAt)은 제외하고 수정일(updatedAt)만 기록
    timestamps: { createdAt: false, updatedAt: true },
    versionKey: false,
  },
);

export const BugReportStatsModel =
  mongoose.models.BugReportStats ||
  mongoose.model<BugReportStatsDocument>(
    "BugReportStats",
    BugReportStatsSchema,
  );
