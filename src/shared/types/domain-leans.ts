import { Types } from "mongoose";
import { FeedStatus } from "./feed";

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

  status: FeedStatus;

  lastFetchedAt: Date | null;

  etag: string | null;

  lastModified: string | null;

  errorCount: number;

  categories: string[];

  createdAt: Date;
  updatedAt: Date;
};

/**
 * FeedItem Lean Type
 *
 * mongoose .lean() 결과 전용 타입
 * - Document 메서드 없음
 * - 순수 JSON 객체 형태
 */
export type FeedItemLean = {
  _id: Types.ObjectId;

  feedId: Types.ObjectId;

  guid?: string | null;

  link: string;

  title: string;

  description: string;

  author?: string | null;

  publishedAt?: Date | null;

  categories: string[];

  hash: string;

  createdAt: Date;
  updatedAt: Date;
};

/**
 * Site Lean Type
 *
 * mongoose .lean() 결과 전용 타입
 * - Document 메서드 없음
 * - timestamps snake_case 반영됨
 */
export type SiteLean = {
  _id: Types.ObjectId;

  /**
   * 사용자가 구독한 원본 페이지 URL
   */
  url: string;

  /**
   * 표시용 사이트 이름
   */
  name: string;

  /**
   * 파비콘 URL (nullable)
   */
  favicon_url: string | null;

  /**
   * RSS/Atom Feed URL (nullable)
   */
  feed_url: string | null;

  /**
   * timestamps (schema에서 snake_case로 설정됨)
   */
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Subscription Lean Type
 *
 * user ↔ feed 관계 (lean 전용)
 */
export type SubscriptionLean = {
  _id: Types.ObjectId;

  /**
   * 구독한 사용자 ID
   */
  userId: Types.ObjectId;

  /**
   * 구독 대상 Feed ID
   */
  feedId: Types.ObjectId;

  /**
   * 생성 시각
   */
  createdAt: Date;

  /**
   * 수정 시각
   */
  updatedAt: Date;
};

/**
 * UserInterestProfile Lean Type
 *
 * 사용자 관심사 프로필 (lean 전용)
 */
export type UserInterestProfileLean = {
  _id: Types.ObjectId;

  /**
   * 사용자 이메일 (unique key)
   */
  userEmail: string;

  /**
   * 선택한 카테고리 ID 목록
   */
  categoryIds: string[];

  /**
   * 선택한 관심사 ID 목록
   */
  interestIds: string[];

  /**
   * 생성 시각
   */
  createdAt: Date;

  /**
   * 수정 시각
   */
  updatedAt: Date;
};

/**
 * BookmarkCollection Lean Type
 *
 * DB에서 lean()으로 조회된 BookmarkCollection 문서 타입
 */
export type BookmarkCollectionLean = {
  /**
   * 컬렉션 ID
   */
  _id: Types.ObjectId;

  /**
   * 컬렉션 소유자
   */
  userId: Types.ObjectId;

  /**
   * 컬렉션 이름
   */
  name: string;

  /**
   * 생성 시각
   */
  createdAt: Date;

  /**
   * 수정 시각
   */
  updatedAt: Date;
};

/**
 * BookmarkCollectionMap Lean Type
 *
 * DB에서 lean()으로 조회된 BookmarkCollectionMap 문서 타입
 */
export type BookmarkCollectionMapLean = {
  /**
   * 매핑 ID
   */
  _id: Types.ObjectId;

  /**
   * 사용자 ID
   */
  userId: Types.ObjectId;

  /**
   * FeedItem ID
   */
  feedItemId: Types.ObjectId;

  /**
   * Collection ID
   */
  collectionId: Types.ObjectId;

  /**
   * 생성 시각
   */
  createdAt: Date;

  /**
   * 수정 시각
   */
  updatedAt: Date;
};
