import { Types } from "mongoose";
import { UserKeywordTargetModel } from "../models/UserKeywordTarget";
import { toObjectId } from "@/shared/utils/toObjectId";

export class UserKeywordTargetRepository {
  async create(data: { userKeywordId: string; subscriptionId: string | null }) {
    return UserKeywordTargetModel.create(data);
  }

  async findByKeywordIds(userKeywordIds: string[]) {
    return UserKeywordTargetModel.find({
      userKeywordId: { $in: userKeywordIds },
    });
  }

  async findByKeywordIdsWithFeed(keywordIds: string[]) {
    return UserKeywordTargetModel.aggregate([
      {
        $match: {
          userKeywordId: {
            $in: keywordIds.map((id) => toObjectId(id)),
          },
        },
      },

      // subscription join
      {
        $lookup: {
          from: "subscriptions",
          localField: "subscriptionId",
          foreignField: "_id",
          as: "subscription",
        },
      },
      { $unwind: "$subscription" },

      // feed join
      {
        $lookup: {
          from: "feeds",
          localField: "subscription.feedId",
          foreignField: "_id",
          as: "feed",
        },
      },
      { $unwind: "$feed" },

      {
        $project: {
          userKeywordId: 1,
          subscriptionId: "$subscription._id",
          feedId: "$feed._id",
          feedName: "$feed.name",
        },
      },
    ]);
  }
}
