import { Schema, model, models, Document } from "mongoose";

/**
 * SiteStats MongoDB Document
 * * 통계 데이터를 위한 별도 컬렉션입니다.
 */
export interface SiteStatsDocument extends Document {
  key: string;

  /** 전체 사이트 수 */
  total: number;

  /** RSS 수집 가능한 사이트 수 (canRss: true) */
  canRss: number;

  /** RSS 수집 불가능한 사이트 수 (canRss: false) */
  noRss: number;
}

const siteStatsSchema = new Schema<SiteStatsDocument>(
  {
    key: { type: String, required: true, unique: true },

    total: {
      type: Number,
      default: 0,
    },
    canRss: {
      type: Number,
      default: 0,
    },
    noRss: {
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
