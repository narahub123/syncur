import { FEED_EXECUTION_LOG_STATS_KEY } from "@/features/admin/logs/constants/stats";
import { FeedExecutionLogStatsModel } from "@/features/feed-execution-logs/model/FeedExecutionLogStat";

export class FeedExecutionLogStatsRepository {
  private readonly STATS_ID = FEED_EXECUTION_LOG_STATS_KEY;

  async incrementStats(data: { total?: number; fails?: number }) {
    return await FeedExecutionLogStatsModel.updateOne(
      { key: this.STATS_ID },
      { $inc: data },
      { upsert: true },
    );
  }
}
