import { Types } from "mongoose";

/**
 * Subscription Lean Type
 *
 * user ↔ feed 관계 (lean 전용)
 */
export type SubscriptionLean = {
  _id: Types.ObjectId;

  /**
   * 구독한 사용자 ID
   */
  userId: Types.ObjectId;

  /**
   * 구독 대상 Feed ID
   */
  feedId: Types.ObjectId;

  deletedAt: Date;

  /**
   * 생성 시각
   */
  createdAt: Date;

  /**
   * 수정 시각
   */
  updatedAt: Date;
};
