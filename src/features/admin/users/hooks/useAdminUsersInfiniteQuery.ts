import { createInfiniteQuery } from "@/features/admin/hooks/createInfiniteQuery";
import { fetchAdminUsers } from "../api/fetchAdminUsers";
import { AdminUsersQuery } from "../types/search";
import { UserDto } from "@/features/users/dto/userDto";
import { UserStatsDTO } from "../dto/UserStatsDTO";

export const useAdminUsersInfiniteQuery = createInfiniteQuery<
  AdminUsersQuery,
  UserDto,
  UserStatsDTO
>("admin-users-infinite", fetchAdminUsers);
