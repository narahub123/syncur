import { Schema, model, models, Types } from "mongoose";

/**
 * UserFeedInteraction Document
 *
 * 특정 사용자와 FeedItem 간의 상호작용 상태를 저장하는 컬렉션
 *
 * 역할:
 * - 사용자 행동 상태 저장 (stateful tracking)
 * - 중복 행동 방지 (idempotency)
 * - 개인화/추천 기반 데이터 제공
 *
 * 특징:
 * - userId + feedItemId 조합 unique
 * - event log가 아닌 "현재 상태" 저장
 */
export interface UserFeedInteractionDocument extends Document {
  /**
   * 사용자 ID
   */
  userId: Types.ObjectId;

  /**
   * FeedItem ID
   */
  feedItemId: Types.ObjectId;

  /**
   * 콘텐츠(기사 원문) 클릭 여부
   *
   * - 실제 콘텐츠 소비 여부 tracking
   */
  hasContentClicked: boolean;

  /**
   * 사이트(출처) 클릭 여부
   *
   * - navigation 행동 여부
   */
  hasSourceClicked: boolean;

  /**
   * 좋아요 여부
   */
  hasLiked: boolean;

  /**
   * 북마크 여부
   */
  hasBookmarked: boolean;

  /**
   * 숨김 여부
   *
   * - 추천/피드 노출 제외 signal
   */
  isHidden: boolean;

  /**
   * 마지막 상호작용 시각
   */
  lastInteractedAt?: Date;

  /**
   * 콘텐츠 클릭 시각
   */
  lastContentClickedAt?: Date;

  /**
   * 사이트 클릭 시각
   */
  lastSourceClickedAt?: Date;

  /**
   * 좋아요 시각
   */
  lastLikedAt?: Date;

  /**
   * 북마크 시각
   */
  lastBookmarkedAt?: Date;

  /**
   * 숨김 처리 시각
   */
  hiddenAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const UserFeedInteractionSchema = new Schema<UserFeedInteractionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    feedItemId: {
      type: Schema.Types.ObjectId,
      ref: "FeedItem",
      required: true,
      index: true,
    },

    hasContentClicked: {
      type: Boolean,
      default: false,
    },

    hasSourceClicked: {
      type: Boolean,
      default: false,
    },

    hasLiked: {
      type: Boolean,
      default: false,
    },

    hasBookmarked: {
      type: Boolean,
      default: false,
    },

    isHidden: {
      type: Boolean,
      default: false,
    },

    lastInteractedAt: {
      type: Date,
      default: null,
    },

    lastContentClickedAt: {
      type: Date,
      default: null,
    },

    lastSourceClickedAt: {
      type: Date,
      default: null,
    },

    lastLikedAt: {
      type: Date,
      default: null,
    },

    lastBookmarkedAt: {
      type: Date,
      default: null,
    },

    hiddenAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Index Strategy
 *
 * - user-feedItem pair uniqueness 보장
 * - 개인화 조회 최적화
 */
UserFeedInteractionSchema.index({ userId: 1, feedItemId: 1 }, { unique: true });

UserFeedInteractionSchema.index({ userId: 1, updatedAt: -1 });
UserFeedInteractionSchema.index({ feedItemId: 1 });

export const UserFeedInteractionModel =
  models.UserFeedInteraction ||
  model<UserFeedInteractionDocument>(
    "UserFeedInteraction",
    UserFeedInteractionSchema,
  );
