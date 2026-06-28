import { SiteStatsDto } from "@/features/rss/site/dto/siteStatsDto";
import { SiteStatsModel } from "@/features/rss/site/model/SiteStats";
import { SITE_STATS_KEY } from "../constants/stats";

export class AdminSiteStatsRepository {
  private readonly STATS_ID = SITE_STATS_KEY;

  async getStats(): Promise<SiteStatsDto> {
    const stats = await SiteStatsModel.findOne({ key: this.STATS_ID });

    return stats
      ? {
          total: stats.total,
          rss: stats.rss,
          crawlable: stats.crawlable,
          unavailable: stats.unavailable,
        }
      : {
          total: 0,
          rss: 0,
          crawlable: 0,
          unavailable: 0,
        };
  }

  async incrementStats(data: {
    total?: number;
    rss?: number;
    crawlable?: number;
    unavailable?: number;
  }) {
    return await SiteStatsModel.updateOne(
      { key: this.STATS_ID },
      { $inc: data },
      { upsert: true },
    );
  }
}
