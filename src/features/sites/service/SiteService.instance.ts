import { SiteService } from "./SiteService";
import { SiteRepository } from "../repository/SiteRepository";
import { AdminSiteStatsService } from "@/features/admin/sites/services/AdminSiteStatsService";
import { adminSiteStatsRepository } from "@/features/admin/sites/repositories/AdminSiteStatsRepository.instance";

export const siteService = new SiteService(
  new SiteRepository(),
  new AdminSiteStatsService(adminSiteStatsRepository),
);
