import { Types, UpdateResult } from "mongoose";
import { UserFeedInteractionModel } from "../models/user-feed-interaction";
import { UserFeedInteractionLean } from "@/shared/types/domain-leans";
import { toObjectId } from "@/shared/utils/toObjectId";

/**
 * UserFeedInteraction 업데이트 payload
 *
 * - partial update 지원
 * - interaction 이벤트별 timestamp 관리
 */
export type UserFeedInteractionUpdate = Partial<{
  hasContentClicked: boolean;
  hasSourceClicked: boolean;
  hasLiked: boolean;
  hasBookmarked: boolean;
  isHidden: boolean;

  lastInteractedAt: Date;
  lastContentClickedAt: Date;
  lastSourceClickedAt: Date;
  lastLikedAt: Date;
  lastBookmarkedAt: Date;
  hiddenAt: Date;
}>;

export class UserFeedInteractionRepository {
  /**
   * interaction document 조회 or 생성
   *
   * @description
   * 없으면 upsert로 기본 document 생성
   */
  async findOrCreate(
    userId: string | Types.ObjectId,
    feedItemId: string | Types.ObjectId,
  ): Promise<UserFeedInteractionLean> {
    return UserFeedInteractionModel.findOneAndUpdate(
      {
        userId: toObjectId(userId),
        feedItemId: toObjectId(feedItemId),
      },
      { $setOnInsert: { userId, feedItemId } },
      { upsert: true, new: true },
    );
  }

  /**
   * interaction 업데이트
   *
   * @description
   * 특정 user + feedItem 기준 partial update 수행
   */
  async update(
    userId: string | Types.ObjectId,
    feedItemId: string | Types.ObjectId,
    update: UserFeedInteractionUpdate,
  ): Promise<UpdateResult> {
    return UserFeedInteractionModel.updateOne(
      {
        userId: toObjectId(userId),
        feedItemId: toObjectId(feedItemId),
      },
      { $set: update },
      { upsert: true },
    );
  }

  /**
   * 단건 interaction 조회
   */
  async find(
    userId: string | Types.ObjectId,
    feedItemId: string | Types.ObjectId,
  ): Promise<UserFeedInteractionLean | null> {
    return UserFeedInteractionModel.findOne({
      userId: toObjectId(userId),
      feedItemId: toObjectId(feedItemId),
    })
      .lean()
      .exec();
  }

  /**
   * bulk 조회 (user + feedItemIds)
   *
   * 목적:
   * - feed list에서 interaction batch merge
   */
  async findByUserAndFeedIds(
    userId: string | Types.ObjectId,
    feedItemIds: (string | Types.ObjectId)[],
  ): Promise<UserFeedInteractionLean[]> {
    return UserFeedInteractionModel.find({
      userId: toObjectId(userId),
      feedItemId: {
        $in: feedItemIds.map((id) => toObjectId(id)),
      },
    }).lean();
  }
}
