import { SiteService } from "./SiteService";
import { SiteRepository } from "../repository/SiteRepository";
import { siteStatsService } from "./SiteStatsService.instance";

export const siteService = new SiteService(
  new SiteRepository(),
  siteStatsService,
);
