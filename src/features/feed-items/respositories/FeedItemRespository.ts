import { FeedItem } from "@/shared/types/feed";
import { FeedItemModel } from "../models/feed-item";

export class FeedItemRespository {
  async findByFeedIds(feedIds: string[]): Promise<FeedItem[]> {
    return FeedItemModel.find({
      feedId: { $in: feedIds },
    }).lean();
  }
}
