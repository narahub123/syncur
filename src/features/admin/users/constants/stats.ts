import { UserStatsDTO } from "@/features/admin/users/dto/UserStatsDTO";

/**
 * UserStatsDTO를 AdminStatsCard에서 사용할 수 있는 형태로 변환합니다.
 */
export const getUserStatsStatusList = (stats: UserStatsDTO) => [
  {
    label: "신규 가입",
    value: stats.newUsersCount,
    color: "text-blue-600", // Tailwind 클래스 사용
  },
  {
    label: "탈퇴",
    value: stats.deletedUsersCount,
    color: "text-red-600",
  },
  {
    label: "활성 유저",
    value: stats.activeUsersCount,
    color: "text-green-600",
  },
];

export const userStatsDefault = (today: string) => ({
  id: "new",
  date: today,
  newUsersCount: 0,
  deletedUsersCount: 0,
  activeUsersCount: 0,
  totalUsersSnapshot: 0,
  isSnapshotInitialized: false,

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
