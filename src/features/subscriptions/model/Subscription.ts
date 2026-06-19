import mongoose, { Schema, Document, Types } from "mongoose";

export interface SubscriptionDocument extends Document {
  userId: Types.ObjectId;
  feedId: Types.ObjectId;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<SubscriptionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    feedId: { type: Schema.Types.ObjectId, ref: "Feed", required: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

// [핵심] 해지되지 않은(null) 구독 건에 대해서만 유니크 제약
SubscriptionSchema.index(
  { userId: 1, feedId: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);

export const SubscriptionModel =
  mongoose.models.Subscription ||
  mongoose.model<SubscriptionDocument>("Subscription", SubscriptionSchema);
