import {
  DetailPageConfig,
  ListingPageConfig,
} from "@/features/ingestion/lib/discover/types";
import { FeedStatus } from "@/shared/types/feed";
import { Types } from "mongoose";
import { CrawlerConfig } from "../model/feed";

/**
 * FeedModel lean() 반환 타입
 *
 * Document wrapper 없이 순수 JSON object
 */
export type FeedLean = {
  _id: Types.ObjectId;

  siteId: Types.ObjectId;

  uniqueKey: string;

  sourceType: "rss" | "crawl";

  name: string;

  feedUrl: string | null;

  listingPageUrl: string | null;

  crawlerConfig?: CrawlerConfig;

  listingPageConfig: ListingPageConfig | null;

  detailPageConfig: DetailPageConfig | null;

  crawlerState?: {
    lastSeenUrl: string | null;
    lastCrawledAt: Date | null;
  };

  status: FeedStatus;

  lastFetchedAt: Date | null;

  etag: string | null;

  lastModified: string | null;

  errorCount: number;

  categories: string[];

  subscriberCount: number;

  createdAt: Date;
  updatedAt: Date;
};
