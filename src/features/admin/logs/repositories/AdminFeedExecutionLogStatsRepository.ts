import { FeedExecutionLogStatsDto } from "@/features/feed-execution-logs/dto/feedExecutionLogStatsDto";
import { FeedExecutionLogStatsModel } from "@/features/feed-execution-logs/model/FeedExecutionLogStat";
import { FEED_EXECUTION_LOG_STATS_KEY } from "../constants/stats";

export class AdminFeedExecutionLogStatsRepository {
  private readonly STATS_ID = FEED_EXECUTION_LOG_STATS_KEY;

  async getStats(): Promise<FeedExecutionLogStatsDto> {
    const stats = await FeedExecutionLogStatsModel.findOne({
      key: this.STATS_ID,
    });

    console.log("report", stats);
    return stats
      ? {
          total: stats.total,
          fails: stats.fails,
        }
      : {
          total: 0,
          fails: 0,
        };
  }

  async incrementStats(data: { total?: number; fails?: number }) {
    return await FeedExecutionLogStatsModel.updateOne(
      { key: this.STATS_ID },
      { $inc: data },
      { upsert: true },
    );
  }
}
