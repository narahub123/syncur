import { Schema, model, models, Document } from "mongoose";

export interface UserStatsDocument extends Document {
  date: string; // YYYY-MM-DD

  // 가입 및 탈퇴 카운트
  newUsersCount: number;
  deletedUsersCount: number;

  // 고유 활성 사용자 목록 (Set 역할)
  activeUsers: string[];

  // 누적 가입자 스냅샷
  totalUsersSnapshot: number;

  isSnapshotInitialized: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const UserStatsSchema = new Schema<UserStatsDocument>(
  {
    date: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    newUsersCount: { type: Number, default: 0 },
    deletedUsersCount: { type: Number, default: 0 },
    activeUsers: { type: [String], default: [] },
    totalUsersSnapshot: { type: Number, default: 0 },
    isSnapshotInitialized: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserStatsModel =
  models.UserStats || model<UserStatsDocument>("UserStats", UserStatsSchema);
