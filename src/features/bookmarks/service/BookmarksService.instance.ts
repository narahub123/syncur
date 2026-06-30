import { UserFeedInteractionRepository } from "@/features/feed-interaction/repositories/UserFeedInteractionRepository";
import { FeedItemRepository } from "@/features/feed-items/repositories/FeedItemRepository";
import { FeedItemStatsRepository } from "@/features/feed-items/repositories/FeedItemStatsRepository";

import { FeedRepository } from "@/features/feeds/repository/FeedRepository";
import { SiteRepository } from "@/features/sites/repository/SiteRepository";

import { BookmarkService } from "./BookmarksService";

export const bookmarkService = new BookmarkService(
  new UserFeedInteractionRepository(),
  new FeedItemRepository(),
  new FeedItemStatsRepository(),
  new FeedRepository(),
  new SiteRepository(),
);
