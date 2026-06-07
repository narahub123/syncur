import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * Subscription Document
 * - user ↔ feed 관계 테이블
 */
export interface SubscriptionDocument extends Document {
  userId: Types.ObjectId;
  feedId: Types.ObjectId;
  siteId: Types.ObjectId; // legacy
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<SubscriptionDocument>(
  {
    /**
     * 구독한 사용자
     */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /**
     * 구독 대상 Site
     */

    feedId: {
      type: Schema.Types.ObjectId,
      ref: "Feed",
      required: true,
    },

    siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * 동일 유저 중복 구독 방지 (핵심)
 */
SubscriptionSchema.index({ userId: 1, feedId: 1 }, { unique: true });

/**
 * Model export (hot reload 대응)
 */
export const SubscriptionModel =
  mongoose.models.Subscription ||
  mongoose.model<SubscriptionDocument>("Subscription", SubscriptionSchema);
