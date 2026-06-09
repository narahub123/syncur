import { Types } from "mongoose";
import { FeedItemStatsModel } from "../models/feed-item-stats";
import { FeedItemStatsLean } from "@/shared/types/domain-leans";
import { toObjectId } from "@/shared/utils/toObjectId";

/**
 * FeedItemStats Repository
 *
 * FeedItem 단위 집계 데이터에 대한
 * MongoDB 접근 계층
 *
 * 특징:
 * - atomic increment / decrement 전용
 * - 비즈니스 로직 포함 금지
 */
export class FeedItemStatsRepository {
  /**
   * 콘텐츠 클릭 증가
   */
  async incrementContentClick(feedItemId: string | Types.ObjectId) {
    return FeedItemStatsModel.updateOne(
      {
        feedItemId: toObjectId(feedItemId),
      },
      {
        $inc: { contentClickCount: 1 },
        $set: { lastInteractedAt: new Date() },
      },
      { upsert: true },
    );
  }

  /**
   * 사이트 클릭 증가
   */
  async incrementSourceClick(feedItemId: string | Types.ObjectId) {
    return FeedItemStatsModel.updateOne(
      {
        feedItemId: toObjectId(feedItemId),
      },
      {
        $inc: { sourceClickCount: 1 },
        $set: { lastInteractedAt: new Date() },
      },
      { upsert: true },
    );
  }

  /**
   * 좋아요 증가
   */
  async incrementLike(feedItemId: string | Types.ObjectId) {
    return FeedItemStatsModel.updateOne(
      {
        feedItemId: toObjectId(feedItemId),
      },
      {
        $inc: { likeCount: 1 },
        $set: { lastInteractedAt: new Date() },
      },
      { upsert: true },
    );
  }

  /**
   * 좋아요 감소
   */
  async decrementLike(feedItemId: string | Types.ObjectId) {
    return FeedItemStatsModel.updateOne(
      {
        feedItemId: toObjectId(feedItemId),
      },
      {
        $inc: { likeCount: -1 },
        $set: { lastInteractedAt: new Date() },
      },
    );
  }

  /**
   * 북마크 증가
   */
  async incrementBookmark(feedItemId: string | Types.ObjectId) {
    return FeedItemStatsModel.updateOne(
      {
        feedItemId: toObjectId(feedItemId),
      },
      {
        $inc: { bookmarkCount: 1 },
        $set: { lastInteractedAt: new Date() },
      },
      { upsert: true },
    );
  }

  /**
   * 북마크 감소
   */
  async decrementBookmark(feedItemId: string | Types.ObjectId) {
    return FeedItemStatsModel.updateOne(
      {
        feedItemId: toObjectId(feedItemId),
      },
      {
        $inc: { bookmarkCount: -1 },
        $set: { lastInteractedAt: new Date() },
      },
    );
  }

  /**
   * 공유 증가
   */
  async incrementShare(feedItemId: string | Types.ObjectId) {
    return FeedItemStatsModel.updateOne(
      {
        feedItemId: toObjectId(feedItemId),
      },
      {
        $inc: { shareCount: 1 },
        $set: { lastInteractedAt: new Date() },
      },
      { upsert: true },
    );
  }

  /**
   * feedIds 기준 stats bulk 조회
   *
   * 목적:
   * - Feed list에서 global stats batch merge
   */
  async findByFeedIds(
    feedItemIds: (string | Types.ObjectId)[],
  ): Promise<FeedItemStatsLean[]> {
    return FeedItemStatsModel.find({
      feedItemId: {
        $in: feedItemIds.map((id) => toObjectId(id)),
      },
    }).lean();
  }
}
