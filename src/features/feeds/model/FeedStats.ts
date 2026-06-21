import { Schema, model, models, Document } from "mongoose";

/**
 * FeedStats MongoDB Document
 *
 * Feed 통계 데이터를 위한 별도 컬렉션입니다.
 */
export interface FeedStatsDocument extends Document {
  /**
   * 통계 문서 식별 키
   *
   * 예:
   * "global"
   */
  key: string;

  /** 전체 Feed 수 */
  total: number;

  /** 활성 Feed 수 */
  active: number;

  /** 비활성 Feed 수 */
  inactive: number;
}

const feedStatsSchema = new Schema<FeedStatsDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },

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
  {
    timestamps: true,
    versionKey: false,
  },
);

export const FeedStatsModel =
  models.FeedStats || model<FeedStatsDocument>("FeedStats", feedStatsSchema);
