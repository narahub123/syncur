import { siteStatsRepository } from "../repository/SiteStatsRepository.instance";
import { SiteStatsService } from "./SiteStatsService";

export const siteStatsService = new SiteStatsService(siteStatsRepository);
