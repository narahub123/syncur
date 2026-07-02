import { UserKeywordSettingModel } from "../models/UserKeywordSetting";
import { FEED_FILTER } from "../constants/feed-filter";
import { NOTIFY_FILTER } from "../constants/notify-filter";

export class UserKeywordSettingRepository {
  async createDefault(userId: string) {
    return UserKeywordSettingModel.create({
      userId,
      defaultFeedFilter: FEED_FILTER.ALL,
      defaultNotifyFilter: NOTIFY_FILTER.ALL,
    });
  }

  async findByUserId(userId: string) {
    return UserKeywordSettingModel.findOne({ userId });
  }
}
