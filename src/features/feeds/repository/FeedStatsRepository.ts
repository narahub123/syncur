import { FEED_STATS_KEY } from "@/features/admin/feeds/constants/stats";
import { FeedStatsModel } from "@/features/feeds/model/FeedStats";

export class FeedStatsRepository {
  private readonly STATS_ID = FEED_STATS_KEY;

  async incrementStats(data: {
    total?: number;
    active?: number;
    inactive?: number;
  }) {
    const stats = await FeedStatsModel.findOne({ key: this.STATS_ID });

    // 없으면 초기 생성 후 바로 반영
    if (!stats) {
      return FeedStatsModel.create({
        key: this.STATS_ID,
        total: Math.max(0, data.total ?? 0),
        active: Math.max(0, data.active ?? 0),
        inactive: Math.max(0, data.inactive ?? 0),
      });
    }

    const nextTotal = (stats.total ?? 0) + (data.total ?? 0);
    const nextActive = (stats.active ?? 0) + (data.active ?? 0);
    const nextInactive = (stats.inactive ?? 0) + (data.inactive ?? 0);

    return FeedStatsModel.updateOne(
      { key: this.STATS_ID },
      {
        $set: {
          total: Math.max(0, nextTotal),
          active: Math.max(0, nextActive),
          inactive: Math.max(0, nextInactive),
        },
      },
    );
  }
}
