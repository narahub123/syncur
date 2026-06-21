import { UserFeedInteractionModel } from "@/features/feed-interaction/models/user-feed-interaction";
import { UserFeedInteractionLean } from "@/shared/types/domain-leans";
import { Types } from "mongoose";
import { UserInteractionStatsDTO } from "../dto/UserInteractionStatsDTO";
import { UserFeedInteractionPopulatedLean } from "../types/leans";

export class AdminUserFeedInteractionRepository {
  /**
   * 사용자의 활동 내역을 페이지네이션으로 조회
   */
  async findByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    items: UserFeedInteractionPopulatedLean[];
    totalCount: number;
  }> {
    const skip = (page - 1) * limit;

    const [items, totalCount] = await Promise.all([
      UserFeedInteractionModel.find({ userId: new Types.ObjectId(userId) })
        .sort({ lastInteractedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("feedItemId", "title url") // FeedItem의 제목과 URL 정보만 가져오기
        .lean(),
      UserFeedInteractionModel.countDocuments({
        userId: new Types.ObjectId(userId),
      }),
    ]);

    return { items, totalCount };
  }

  /**
   * 사용자의 활동 통계 조회 (좋아요 수, 북마크 수 등)
   */
  async getInteractionStats(userId: string): Promise<UserInteractionStatsDTO> {
    const stats = await UserFeedInteractionModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$userId",
          totalLiked: { $sum: { $cond: ["$hasLiked", 1, 0] } },
          totalBookmarked: { $sum: { $cond: ["$hasBookmarked", 1, 0] } },
          totalClicked: { $sum: { $cond: ["$hasContentClicked", 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0, // _id를 제외함
          totalLiked: 1,
          totalBookmarked: 1,
          totalClicked: 1,
        },
      },
    ]);

    return stats[0] || { totalLiked: 0, totalBookmarked: 0, totalClicked: 0 };
  }

  /**
   * 특정 피드 아이템에 대한 사용자의 반응 조회 (단일 상세 조회)
   */
  async findByFeedItem(
    userId: string,
    feedItemId: string,
  ): Promise<UserFeedInteractionLean> {
    return await UserFeedInteractionModel.findOne({
      userId: new Types.ObjectId(userId),
      feedItemId: new Types.ObjectId(feedItemId),
    })
      .populate("feedItemId")
      .lean();
  }
}
