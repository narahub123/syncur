import mongoose, { Schema, Types, Document } from "mongoose";

/**
 * UserKeywordTarget Document
 */
export interface UserKeywordTargetDocument extends Document {
  /**
   * 대상 키워드 ID
   */
  userKeywordId: Types.ObjectId;

  /**
   * 적용 대상 구독 ID
   *
   * null이면 모든 구독에 적용한다.
   */
  subscriptionId?: Types.ObjectId | null;

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
 * UserKeywordTarget Schema
 */
const UserKeywordTargetSchema = new Schema<UserKeywordTargetDocument>(
  {
    /**
     * 대상 키워드
     */
    userKeywordId: {
      type: Schema.Types.ObjectId,
      ref: "UserKeyword",
      required: true,
    },

    /**
     * 적용 대상 구독
     *
     * null이면 모든 구독에 적용한다.
     */
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * 동일 키워드의 동일 구독 중복 방지
 *
 * subscriptionId가 null이면
 * 전역 적용 레코드는 하나만 생성된다.
 */
UserKeywordTargetSchema.index(
  {
    userKeywordId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      subscriptionId: null,
    },
  },
);

/**
 * 키워드 + 구독 조합 중복 방지
 */
UserKeywordTargetSchema.index(
  {
    userKeywordId: 1,
    subscriptionId: 1,
  },
  {
    unique: true,
  },
);

/**
 * 키워드 기준 조회
 */
UserKeywordTargetSchema.index({
  userKeywordId: 1,
});

/**
 * 구독 기준 조회
 */
UserKeywordTargetSchema.index({
  subscriptionId: 1,
});

/**
 * (권장) 역조회 최적화
 * 특정 구독에 어떤 키워드가 적용됐는지 빠르게 조회
 */
UserKeywordTargetSchema.index({
  subscriptionId: 1,
  userKeywordId: 1,
});

export const UserKeywordTargetModel =
  mongoose.models.UserKeywordTarget ||
  mongoose.model<UserKeywordTargetDocument>(
    "UserKeywordTarget",
    UserKeywordTargetSchema,
  );
