import { FeedItemStatsRepository } from "../respositories/FeedItemStatsRepository";
import { FeedItemStatsService } from "./FeedItemStatsService";

export const feedItemStatsService = new FeedItemStatsService(
  new FeedItemStatsRepository(),
);
