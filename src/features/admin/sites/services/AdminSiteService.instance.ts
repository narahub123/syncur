import { AdminSiteRepository } from "../repositories/AdminSiteRepository";
import { adminSiteStatsRepository } from "../repositories/AdminSiteStatsRepository.instance";
import { AdminSiteService } from "./AdminSiteService";
import { AdminSiteStatsService } from "./AdminSiteStatsService";

export const adminSiteService = new AdminSiteService(
  new AdminSiteRepository(),
  new AdminSiteStatsService(adminSiteStatsRepository),
);
