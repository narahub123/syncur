export type UserStatsDTO = {
  id: string;
  date: string;
  newUsersCount: number;
  deletedUsersCount: number;
  activeUsersCount: number;
  totalUsersSnapshot: number;
  isSnapshotInitialized: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserStatsBaseDTO = {
  newUsersCount: number;
  deletedUsersCount: number;
  activeUsersCount: number;
  totalUsersSnapshot: number;
  isSnapshotInitialized: boolean;
};
