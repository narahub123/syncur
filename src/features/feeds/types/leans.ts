import { FeedStatus } from "@/shared/types/feed";
import { Types } from "mongoose";

/**
 * FeedModel lean() 반환 타입
 *
 * Document wrapper 없이 순수 JSON object
 */
export type FeedLean = {
  _id: Types.ObjectId;

  siteId: Types.ObjectId;

  feedUrl: string;

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
