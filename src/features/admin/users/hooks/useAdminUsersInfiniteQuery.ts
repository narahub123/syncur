import { createInfiniteQuery } from "@/features/admin/hooks/createInfiniteQuery";
import { fetchAdminUsers } from "../api/fetchAdminUsers";
import { AdminUsersQuery } from "../types/search";
import { UserDto } from "@/features/users/dto/userDto";

export const useAdminUsersInfiniteQuery = createInfiniteQuery<
  AdminUsersQuery,
  UserDto,
  unknown
>("admin-users-infinite", fetchAdminUsers);
