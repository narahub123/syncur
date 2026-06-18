import { adminFeedStatsRepository } from "../repositories/AdminFeedStatsRepository.instance";
import { AdminFeedStatsService } from "./AdminFeedStatsService";

export const adminFeedStatsService = new AdminFeedStatsService(
  adminFeedStatsRepository,
);
