import { FeedStatsDto } from "@/features/feeds/dto/feedStatsDto";
import { FeedStatsModel } from "@/features/feeds/model/FeedStats";
import { FEED_STATS_KEY } from "../constants/stats";

export class AdminFeedStatsRepository {
  private readonly STATS_ID = FEED_STATS_KEY;

  async getStats(): Promise<FeedStatsDto> {
    const stats = await FeedStatsModel.findOne({ key: this.STATS_ID });

    return stats
      ? {
          total: stats.total,
          active: stats.active,
          inactive: stats.inactive,
        }
      : {
          total: 0,
          active: 0,
          inactive: 0,
        };
  }
}
