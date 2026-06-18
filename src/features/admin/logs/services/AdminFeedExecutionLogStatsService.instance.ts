import { adminFeedExecutionLogStatsRepository } from "../repositories/AdminFeedExecutionLogStatsRepository.instance";
import { AdminFeedExecutionLogStatsService } from "./AdminFeedExecutionLogStatsService";

export const adminFeedExecutionLogStatsService =
  new AdminFeedExecutionLogStatsService(adminFeedExecutionLogStatsRepository);
