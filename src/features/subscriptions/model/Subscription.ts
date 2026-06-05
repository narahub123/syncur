import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * Subscription Document
 * - user ↔ site 관계 테이블
 */
export interface SubscriptionDocument extends Document {
  userId: Types.ObjectId;
  siteId: Types.ObjectId;
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
 * 동일 사용자가 같은 Site를 중복 구독하지 못하게 제한
 */
SubscriptionSchema.index({ userId: 1, siteId: 1 }, { unique: true });

/**
 * Model export (hot reload 대응)
 */
export const SubscriptionModel =
  mongoose.models.Subscription ||
  mongoose.model<SubscriptionDocument>("Subscription", SubscriptionSchema);
