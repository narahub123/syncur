import { FeedFilter } from "../constants/feed-filter";
import { NotifyFilter } from "../constants/notify-filter";
import { userKeywordSettingRepository } from "../repositories/UserKeywordSettingRepository.instance";

export class UserKeywordSettingService {
  async createDefaultIfNotExists(userId: string) {
    const existing = await userKeywordSettingRepository.findByUserId(userId);

    if (existing) return existing;

    return userKeywordSettingRepository.createDefault(userId);
  }

  async getByUserId(userId: string) {
    const data = await userKeywordSettingRepository.findByUserId(userId);

    if (!data) return null;

    return {
      _id: data._id.toString(),
      userId: data.userId.toString(),
      defaultFeedFilter: data.defaultFeedFilter,
      defaultNotifyFilter: data.defaultNotifyFilter,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    };
  }

  async updateFeedFilter(userId: string, feedFilter: FeedFilter) {
    const data = await userKeywordSettingRepository.updateFeedFilter({
      userId,
      feedFilter,
    });

    return {
      _id: data._id.toString(),
      userId: data.userId.toString(),
      defaultFeedFilter: data.defaultFeedFilter,
      defaultNotifyFilter: data.defaultNotifyFilter,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    };
  }

  async updateNotifyFilter(userId: string, notifyFilter: NotifyFilter) {
    const data = await userKeywordSettingRepository.updateNotifyFilter({
      userId,
      notifyFilter,
    });

    return {
      _id: data._id.toString(),
      userId: data.userId.toString(),
      defaultFeedFilter: data.defaultFeedFilter,
      defaultNotifyFilter: data.defaultNotifyFilter,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    };
  }
}
