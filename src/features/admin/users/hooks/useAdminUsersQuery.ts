import { useQuery } from "@tanstack/react-query";
import { fetchAdminUsers } from "../api/fetchAdminUsers";

type Params = {
  search?: string;
  limit?: number;
  page?: number;
};

export function useAdminUsersQuery(params: Params) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => fetchAdminUsers(params),
    staleTime: 1000 * 60, // 1분 (admin list는 너무 자주 안 바뀜)
    placeholderData: (prev) => prev,
  });
}
