import { FEED_STATS_KEY } from "@/features/admin/feeds/constants/stats";
import { FeedStatsModel } from "@/features/feeds/model/FeedStats";

export class FeedStatsRepository {
  private readonly STATS_ID = FEED_STATS_KEY;

  async incrementStats(data: {
    total?: number;
    active?: number;
    inactive?: number;
  }) {
    return await FeedStatsModel.updateOne(
      { key: this.STATS_ID },
      { $inc: data },
      { upsert: true },
    );
  }
}
