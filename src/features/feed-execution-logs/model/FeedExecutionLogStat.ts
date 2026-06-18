import { Schema, model, models, Document } from "mongoose";

/**
 * FeedExecutionLogStats MongoDB Document
 *
 * Feed Execution Log 통계 데이터를 위한 별도 컬렉션입니다.
 */
export interface FeedExecutionLogStatsDocument extends Document {
  /**
   * 통계 문서 식별 키
   *
   * 예:
   * "global"
   */
  key: string;

  /** 전체 실행 로그 수 */
  total: number;

  /** 실패한 실행 로그 수 */
  fails: number;
}

const feedExecutionLogStatsSchema = new Schema<FeedExecutionLogStatsDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },

    total: {
      type: Number,
      default: 0,
    },

    fails: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const FeedExecutionLogStatsModel =
  models.FeedExecutionLogStats ||
  model<FeedExecutionLogStatsDocument>(
    "FeedExecutionLogStats",
    feedExecutionLogStatsSchema,
  );
