import { UserFeedInteractionLean } from "@/shared/types/domain-leans";
import { Types } from "mongoose";

export type UserStatsLean = {
  _id: Types.ObjectId;
  date: string;
  newUsersCount: number;
  deletedUsersCount: number;
  activeUsers: string[]; // 추가됨: 고유 유저 ID 배열
  totalUsersSnapshot: number;
  isSnapshotInitialized: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PopulatedFeedItem = {
  _id: Types.ObjectId;
  title: string;
  url: string;
};

// populate된 결과까지 포함한 새로운 Lean 타입
export type UserFeedInteractionPopulatedLean = Omit<
  UserFeedInteractionLean,
  "feedItemId"
> & {
  feedItemId: PopulatedFeedItem;
};
