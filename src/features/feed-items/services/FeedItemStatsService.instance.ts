import { FeedItemStatsRepository } from "../repositories/FeedItemStatsRepository";
import { FeedItemStatsService } from "./FeedItemStatsService";

export const feedItemStatsService = new FeedItemStatsService(
  new FeedItemStatsRepository(),
);
