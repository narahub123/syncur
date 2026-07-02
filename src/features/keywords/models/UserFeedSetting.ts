import mongoose, { Schema, Types, Document } from "mongoose";
import { FEED_FILTER, FeedFilter } from "../constants/feed-filter";
import { NOTIFY_FILTER, NotifyFilter } from "../constants/notify-filter";

export interface UserFeedSettingDocument extends Document {
  userId: Types.ObjectId;

  subscriptionId: Types.ObjectId;

  feedFilter: FeedFilter;

  notifyFilter: NotifyFilter;

  createdAt: Date;
  updatedAt: Date;
}

const UserFeedSettingSchema = new Schema<UserFeedSettingDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },

    feedFilter: {
      type: String,
      enum: Object.values(FEED_FILTER),
      default: FEED_FILTER.DEFAULT,
    },

    notifyFilter: {
      type: String,
      enum: Object.values(NOTIFY_FILTER),
      default: NOTIFY_FILTER.DEFAULT,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

UserFeedSettingSchema.index({ userId: 1, subscriptionId: 1 }, { unique: true });

export const UserFeedSettingModel =
  mongoose.models.UserFeedSetting ||
  mongoose.model<UserFeedSettingDocument>(
    "UserFeedSetting",
    UserFeedSettingSchema,
  );
