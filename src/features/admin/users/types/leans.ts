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
