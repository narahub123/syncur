import { adminSiteStatsRepository } from "../repositories/AdminSiteStatsRepository.instance";
import { AdminSiteStatsService } from "./AdminSiteStatsService";

export const adminSiteStatsService = new AdminSiteStatsService(
  adminSiteStatsRepository,
);
