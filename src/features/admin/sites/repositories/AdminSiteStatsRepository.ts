import { SiteStatsDto } from "@/features/rss/site/dto/siteStatsDto";
import { SiteStatsModel } from "@/features/rss/site/model/SiteStats";
import { SITE_STATS_KEY } from "../constants/stats";

export class AdminSiteStatsRepository {
  private readonly STATS_ID = SITE_STATS_KEY;

  async getStats(): Promise<SiteStatsDto> {
    const stats = await SiteStatsModel.findOne({ key: this.STATS_ID });

    // DB Document에서 필요한 필드만 뽑아서(Dto에 맞춰) 반환
    return stats
      ? { total: stats.total, canRss: stats.canRss, noRss: stats.noRss }
      : { total: 0, canRss: 0, noRss: 0 };
  }

  async incrementStats(data: {
    total?: number;
    canRss?: number;
    noRss?: number;
  }) {
    return await SiteStatsModel.updateOne(
      { key: this.STATS_ID },
      { $inc: data },
      { upsert: true },
    );
  }
}
