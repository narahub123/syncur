import { Types } from "mongoose";
import { UserFeedInteractionModel } from "../models/user-feed-interaction";

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
  async findOrCreate(userId: string, feedItemId: string) {
    return UserFeedInteractionModel.findOneAndUpdate(
      { userId, feedItemId },
      { $setOnInsert: { userId, feedItemId } },
      { upsert: true, new: true },
    );
  }

  async update(
    userId: string,
    feedItemId: string,
    update: UserFeedInteractionUpdate,
  ) {
    return UserFeedInteractionModel.updateOne(
      { userId, feedItemId },
      { $set: update },
      { upsert: true },
    );
  }

  async find(userId: string, feedItemId: string) {
    return UserFeedInteractionModel.findOne({ userId, feedItemId });
  }

  /**
   * userId + feedIds 기준 bulk 조회
   *
   * 목적:
   * - Feed list에서 user interaction batch merge
   */
  async findByUserAndFeedIds(userId: string, feedItemIds: string[]) {
    return UserFeedInteractionModel.find({
      userId: new Types.ObjectId(userId),
      feedItemId: {
        $in: feedItemIds.map((id) => new Types.ObjectId(id)),
      },
    }).lean();
  }
}
