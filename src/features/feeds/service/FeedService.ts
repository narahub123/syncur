import { Site } from "@/shared/types/site";
import { feedRepository } from "../repository/FeedRepository.instance";
import { Feed } from "@/shared/types/feed";
import { getFeedItems } from "./getMyFeedItems/getFeedItems";

export class FeedService {
  async ensureFeed(site: Site): Promise<Feed | null> {
    if (!site?.feed_url) return null;

    let feed = await feedRepository.findBySiteId(site._id);

    if (!feed) {
      feed = await feedRepository.create({
        siteId: site._id.toString(),
        feedUrl: site.feed_url,
        status: "active",
        errorCount: 0,
        categories: [],
      });
    }

    return feed;
  }

  async getMyFeedItems(userId: string, cursor?: string) {
    return getFeedItems(userId, cursor);
  }
}
