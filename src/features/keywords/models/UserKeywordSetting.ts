import mongoose, { Schema, Types, Document } from "mongoose";
import { FEED_FILTER, FeedFilter } from "../constants/feed-filter";
import { NOTIFY_FILTER, NotifyFilter } from "../constants/notify-filter";

/**
 * UserKeywordSetting Document
 */
export interface UserKeywordSettingDocument extends Document {
  /**
   * 설정 사용자 ID
   */
  userId: Types.ObjectId;

  /**
   * 피드 수신 범위 기본값
   *
   * 소스별 설정이 없을 경우 적용
   */
  defaultFeedFilter: FeedFilter;

  /**
   * 알림 수신 범위 기본값
   *
   * 소스별 설정이 없을 경우 적용
   */
  defaultNotifyFilter: NotifyFilter;

  /**
   * 생성일시
   */
  createdAt: Date;

  /**
   * 수정일시
   */
  updatedAt: Date;
}

/**
 * UserKeywordSetting Schema
 */
const UserKeywordSettingSchema = new Schema<UserKeywordSettingDocument>(
  {
    /**
     * 설정 사용자
     */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /**
     * 피드 수신 범위 기본값
     *
     * ALL          - 모든 글 수신
     * KEYWORD_ONLY - 키워드 매칭 글만 수신
     */
    defaultFeedFilter: {
      type: String,
      enum: Object.values(FEED_FILTER),
      default: FEED_FILTER.ALL,
    },

    /**
     * 알림 수신 범위 기본값
     *
     * ALL          - 모든 글 알림
     * KEYWORD_ONLY - 키워드 매칭 글만 알림
     */
    defaultNotifyFilter: {
      type: String,
      enum: Object.values(NOTIFY_FILTER),
      default: NOTIFY_FILTER.ALL,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * 사용자 1명당 1개의 설정만 허용
 */
UserKeywordSettingSchema.index({ userId: 1 }, { unique: true });

export const UserKeywordSettingModel =
  mongoose.models.UserKeywordSetting ||
  mongoose.model<UserKeywordSettingDocument>(
    "UserKeywordSetting",
    UserKeywordSettingSchema,
  );
