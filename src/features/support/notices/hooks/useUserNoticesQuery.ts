import { useQuery } from "@tanstack/react-query";
import { UserNoticesQuery } from "../types/search";
import { getNoticesAction } from "../actions/getNoticesAction";

export function useUserNoticesQuery(query: UserNoticesQuery) {
  return useQuery({
    queryKey: ["notices", query],
    queryFn: () => getNoticesAction(query),
    placeholderData: (previousData) => previousData, // 페이지 이동 시 깜빡임 방지
  });
}
