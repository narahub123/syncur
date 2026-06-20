import { useQuery } from "@tanstack/react-query";
import { fetchAdminUsers } from "../api/fetchAdminUsers";
import { AdminUsersQuery } from "../types/search";

export function useAdminUsersQuery(query: AdminUsersQuery) {
  return useQuery({
    queryKey: ["admin-users", query],
    queryFn: () => fetchAdminUsers(query),
    staleTime: 1000 * 60, // 1분 (admin list는 너무 자주 안 바뀜)
    placeholderData: (prev) => prev,
  });
}
