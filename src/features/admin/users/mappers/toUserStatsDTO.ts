import { UserStatsDTO } from "../dto/UserStatsDTO";
import { UserStatsLean } from "../types/leans";

export const toUserStatsDTO = (data: UserStatsLean): UserStatsDTO => {
  return {
    id: data._id.toString(),
    date: data.date,
    newUsersCount: data.newUsersCount,
    deletedUsersCount: data.deletedUsersCount,
    activeUsersCount: data.activeUsers.length,
    totalUsersSnapshot: data.totalUsersSnapshot,
    isSnapshotInitialized: data.isSnapshotInitialized,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};

export const toUserStatsDTOs = (data: UserStatsLean[]): UserStatsDTO[] => {
  return data.map(toUserStatsDTO);
};
