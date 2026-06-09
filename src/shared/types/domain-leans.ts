import { Types } from "mongoose";
import { FeedStauts } from "./feed";

/**
 * UserFeedInteraction lean type
 * - mongoose Document wrapper 제거된 순수 DB 결과
 */
export type UserFeedInteractionLean = {
  _id: Types.ObjectId;

  userId: Types.ObjectId;
  feedItemId: Types.ObjectId;

  hasContentClicked: boolean;
  hasSourceClicked: boolean;
  hasLiked: boolean;
  hasBookmarked: boolean;
  isHidden: boolean;

  lastInteractedAt: Date | null;
  lastContentClickedAt: Date | null;
  lastSourceClickedAt: Date | null;
  lastLikedAt: Date | null;
  lastBookmarkedAt: Date | null;
  hiddenAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
};

/**
 * FeedItemStats lean type
 * - aggregation 없이 단일 document 기준
 */
export type FeedItemStatsLean = {
  _id: Types.ObjectId;

  feedItemId: Types.ObjectId;

  contentClickCount: number;
  sourceClickCount: number;
  likeCount: number;
  bookmarkCount: number;
  shareCount: number;

  lastInteractedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
};

/**
 * FeedModel lean() 반환 타입
 *
 * Document wrapper 없이 순수 JSON object
 */
export type FeedLean = {
  _id: Types.ObjectId;

  siteId: Types.ObjectId;

  feedUrl: string;

  status: FeedStauts;

  lastFetchedAt: Date | null;

  etag: string | null;

  lastModified: string | null;

  errorCount: number;

  categories: string[];

  createdAt: Date;
  updatedAt: Date;
};
