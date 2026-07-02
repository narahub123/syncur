import { FEED_FILTER, FeedFilter } from "../constants/feed-filter";
import { NOTIFY_FILTER, NotifyFilter } from "../constants/notify-filter";
import { UserFeedSettingDocument } from "../models/UserFeedSetting";
import { UserFeedSettingRepository } from "../repositories/UserFeedSettingRepository";

const toResponse = (doc: UserFeedSettingDocument | null) => {
  if (!doc) return null;

  return {
    _id: String(doc._id),
    userId: String(doc.userId),
    subscriptionId: String(doc.subscriptionId),
    feedFilter: doc.feedFilter,
    notifyFilter: doc.notifyFilter,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
};

export class UserFeedSettingService {
  constructor(private readonly repository: UserFeedSettingRepository) {}

  async getBySubscriptionId(userId: string, subscriptionId: string) {
    const doc = await this.repository.findBySubscriptionIdWithFeed(
      userId,
      subscriptionId,
    );

    if (!doc) {
      return {
        userId,
        subscriptionId,
        feedName: "",
        feedFilter: FEED_FILTER.DEFAULT,
        notifyFilter: NOTIFY_FILTER.DEFAULT,
      };
    }

    return {
      userId: doc.userId.toString(),
      subscriptionId: doc.subscriptionId._id.toString(),
      feedName: doc.subscriptionId.feedId.name,
      feedFilter: doc.feedFilter,
      notifyFilter: doc.notifyFilter,
    };
  }

  async updateFeedFilter(params: {
    userId: string;
    subscriptionId: string;
    feedFilter: FeedFilter;
  }) {
    const result = await this.repository.updateFeedFilter(params);
    return toResponse(result);
  }

  async updateNotifyFilter(params: {
    userId: string;
    subscriptionId: string;
    notifyFilter: NotifyFilter; // NotifyFilter로 바꿔도 됨
  }) {
    const result = await this.repository.updateNotifyFilter(params);
    return toResponse(result);
  }
}
