import { feedExecutionLogStatsRepository } from "../repository/FeedExecutionLogStatsRepository.instance";
import { FeedExecutionLogStatsService } from "./FeedExecutionLogStatsService";

export const feedExecutionLogStatsService = new FeedExecutionLogStatsService(
  feedExecutionLogStatsRepository,
);
