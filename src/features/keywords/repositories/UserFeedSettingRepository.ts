import { FeedFilter } from "../constants/feed-filter";
import { NotifyFilter } from "../constants/notify-filter";
import { UserFeedSettingModel } from "../models/UserFeedSetting";

export class UserFeedSettingRepository {
  async findBySubscriptionId(userId: string, subscriptionId: string) {
    return UserFeedSettingModel.findOne({ userId, subscriptionId });
  }

  async findBySubscriptionIdWithFeed(userId: string, subscriptionId: string) {
    return UserFeedSettingModel.findOne({ userId, subscriptionId }).populate({
      path: "subscriptionId",
      select: "_id feedId",
      populate: {
        path: "feedId",
        select: "name",
      },
    });
  }

  async updateFeedFilter(params: {
    userId: string;
    subscriptionId: string;
    feedFilter: FeedFilter;
  }) {
    return UserFeedSettingModel.findOneAndUpdate(
      {
        userId: params.userId,
        subscriptionId: params.subscriptionId,
      },
      {
        $set: {
          feedFilter: params.feedFilter,
        },
      },
      { returnDocument: "after", upsert: true },
    );
  }

  async updateNotifyFilter(params: {
    userId: string;
    subscriptionId: string;
    notifyFilter: NotifyFilter;
  }) {
    return UserFeedSettingModel.findOneAndUpdate(
      {
        userId: params.userId,
        subscriptionId: params.subscriptionId,
      },
      {
        $set: {
          notifyFilter: params.notifyFilter,
        },
      },
      { returnDocument: "after", upsert: true },
    );
  }
}
