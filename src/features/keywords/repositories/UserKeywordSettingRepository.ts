import { UserKeywordSettingModel } from "../models/UserKeywordSetting";
import { FEED_FILTER, FeedFilter } from "../constants/feed-filter";
import { NOTIFY_FILTER, NotifyFilter } from "../constants/notify-filter";

export class UserKeywordSettingRepository {
  async createDefault(userId: string) {
    return UserKeywordSettingModel.create({
      userId,
      defaultFeedFilter: FEED_FILTER.ALL,
      defaultNotifyFilter: NOTIFY_FILTER.ALL,
    });
  }

  async findByUserId(userId: string) {
    return UserKeywordSettingModel.findOne({ userId }).lean();
  }

  async updateFeedFilter(params: { userId: string; feedFilter: FeedFilter }) {
    return UserKeywordSettingModel.findOneAndUpdate(
      { userId: params.userId },
      {
        $set: {
          defaultFeedFilter: params.feedFilter,
        },
      },
      { returnDocument: "after" },
    );
  }

  async updateNotifyFilter(params: {
    userId: string;
    notifyFilter: NotifyFilter;
  }) {
    return UserKeywordSettingModel.findOneAndUpdate(
      { userId: params.userId },
      {
        $set: {
          defaultNotifyFilter: params.notifyFilter,
        },
      },
      { returnDocument: "after" },
    );
  }
}
