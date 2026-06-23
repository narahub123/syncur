import { FEED_STATS_KEY } from "@/features/admin/feeds/constants/stats";
import { FeedStatsModel } from "@/features/feeds/model/FeedStats";

export class FeedStatsRepository {
  async incrementStats(data: {
    total?: number;
    active?: number;
    inactive?: number;
  }) {
    const stats = await FeedStatsModel.findOne({ key: FEED_STATS_KEY });

    // 없으면 초기 생성 후 바로 반영
    if (!stats) {
      return FeedStatsModel.create({
        key: FEED_STATS_KEY,
        total: Math.max(0, data.total ?? 0),
        active: Math.max(0, data.active ?? 0),
        inactive: Math.max(0, data.inactive ?? 0),
      });
    }

    const nextTotal = (stats.total ?? 0) + (data.total ?? 0);
    const nextActive = (stats.active ?? 0) + (data.active ?? 0);
    const nextInactive = (stats.inactive ?? 0) + (data.inactive ?? 0);

    return FeedStatsModel.updateOne(
      { key: FEED_STATS_KEY },
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
