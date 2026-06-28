import { Schema, model, models, Document } from "mongoose";

/**
 * SiteStats MongoDB Document
 *
 * 사이트 수집 가능 상태 통계를 저장하는 컬렉션
 */
export interface SiteStatsDocument extends Document {
  key: string;

  /** 전체 사이트 수 */
  total: number;

  /** RSS 기반 수집 가능 사이트 수 */
  rss: number;

  /** 크롤링 기반 수집 가능 사이트 수 */
  crawlable: number;

  /** 수집 불가능 사이트 수 */
  unavailable: number;
}

const siteStatsSchema = new Schema<SiteStatsDocument>(
  {
    key: { type: String, required: true, unique: true },

    total: {
      type: Number,
      default: 0,
    },

    rss: {
      type: Number,
      default: 0,
    },

    crawlable: {
      type: Number,
      default: 0,
    },

    unavailable: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SiteStatsModel =
  models.SiteStats || model<SiteStatsDocument>("SiteStats", siteStatsSchema);
