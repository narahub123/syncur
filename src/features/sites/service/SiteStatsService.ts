import { SiteFeedStatus } from "@/features/sites/types";
import { SiteStatsRepository } from "../repository/SiteStatsRepository";

export class SiteStatsService {
  constructor(private readonly siteStatsRepository: SiteStatsRepository) {}

  async incrementByFeedStatus(feedStatus: Exclude<SiteFeedStatus, "pending">) {
    return this.siteStatsRepository.incrementByFeedStatus(feedStatus);
  }
}
