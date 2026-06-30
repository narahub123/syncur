import { FeedExecutionLogStatsDto } from "@/features/feed-execution-logs/dto/feedExecutionLogStatsDto";
import { FeedStatsDto } from "@/features/feeds/dto/feedStatsDto";
import { SiteStatsDto } from "@/features/sites/dto/siteStatsDto";
import { BugReportStatsDTO } from "@/features/support/bug-reports/dto/bugReportStatsDTO";
import { InquiryStatsDTO } from "@/features/support/inquiries/dto/inquiryStatDTO";
import { Schema, model, models, Document } from "mongoose";

/**
 * AdminDashboardStats MongoDB Document
 * * 어드민 대시보드 통합 메트릭 컬렉션
 */
export interface AdminDashboardStatsDocument extends Document {
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

      rss: { type: Number, default: 0 },

      crawlable: { type: Number, default: 0 },

      unavailable: { type: Number, default: 0 },
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
    timestamps: true,
    versionKey: false,
  },
);

export const AdminDashboardStatsModel =
  models.AdminDashboardStats ||
  model<AdminDashboardStatsDocument>(
    "AdminDashboardStats",
    adminDashboardStatsSchema,
  );
