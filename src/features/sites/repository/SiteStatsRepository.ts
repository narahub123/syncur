import { SITE_STATS_KEY } from "@/features/admin/sites/constants/stats";
import { SiteStatsModel } from "../model/SiteStats";
import { SiteFeedStatus } from "../types";

export class SiteStatsRepository {
  private readonly STATS_ID = SITE_STATS_KEY;

  async incrementByFeedStatus(feedStatus: SiteFeedStatus) {
    const inc = {
      total: 1,
      rss: 0,
      crawlable: 0,
      unavailable: 0,
    };

    if (feedStatus === "rss") {
      inc.rss = 1;
    }

    if (feedStatus === "crawlable") {
      inc.crawlable = 1;
    }

    if (feedStatus === "unavailable") {
      inc.unavailable = 1;
    }

    return SiteStatsModel.findOneAndUpdate(
      { key: this.STATS_ID },
      {
        $inc: inc,
      },
      {
        upsert: true,
        new: true,
      },
    );
  }
}
