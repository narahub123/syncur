import { FeedExecutionLogStatsDto } from "@/features/feed-execution-logs/dto/feedExecutionLogStatsDto";
import { FeedStatsDto } from "@/features/feeds/dto/feedStatsDto";
import { SiteStatsDto } from "@/features/rss/site/dto/siteStatsDto";
import { BugReportStatsDTO } from "@/features/support/bug-reports/dto/bugReportStatsDTO";
import { InquiryStatsDTO } from "@/features/support/inquiries/dto/inquiryStatDTO";
import { Schema, model, models, Document } from "mongoose";

/**
 * AdminDashboardStats MongoDB Document
 * * 어드민 대시보드 메트릭을 위한 통합 통계 컬렉션입니다.
 * * 대시보드 진입 시 `{ key: "dashboard_overview" }` 등 지정된 키로 단일 도큐먼트를 조회합니다.
 */
export interface AdminDashboardStatsDocument extends Document {
  /** 도큐먼트 유일 식별자 고정 키 */
  key: string;

  sites: SiteStatsDto;

  feeds: FeedStatsDto;

  feedExecutionLogs: FeedExecutionLogStatsDto;

  bugReports: BugReportStatsDTO;

  inquiries: InquiryStatsDTO;
}

const adminDashboardStatsSchema = new Schema<AdminDashboardStatsDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },

    sites: {
      total: { type: Number, default: 0 },
      canRss: { type: Number, default: 0 },
      noRss: { type: Number, default: 0 },
    },

    feeds: {
      total: {
        type: Number,
        default: 0,
        min: 0,
      },

      active: {
        type: Number,
        default: 0,
        min: 0,
      },

      inactive: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    feedExecutionLogs: {
      total: {
        type: Number,
        default: 0,
      },

      fails: {
        type: Number,
        default: 0,
      },
    },

    bugReports: {
      total: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
      checking: { type: Number, default: 0 },
      fixing: { type: Number, default: 0 },
    },

    inquiries: {
      total: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
      processing: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
    versionKey: false, // __v 필드 생략
  },
);

export const AdminDashboardStatsModel =
  models.AdminDashboardStats ||
  model<AdminDashboardStatsDocument>(
    "AdminDashboardStats",
    adminDashboardStatsSchema,
  );
