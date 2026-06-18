import { feedStatsRepository } from "../repository/FeedStatsRepository.instance";
import { FeedStatsService } from "./FeedStatService";

export const feedStatsService = new FeedStatsService(feedStatsRepository);
