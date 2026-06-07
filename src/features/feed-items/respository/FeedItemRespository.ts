import { FeedItem } from "@/shared/types/feed";
import { FeedItemModel } from "../model/feed-item";

export class FeedItemRespository {
  async findByFeedIds(feedIds: string[]): Promise<FeedItem[]> {
    return FeedItemModel.find({
      feedId: { $in: feedIds },
    }).lean();
  }
}
