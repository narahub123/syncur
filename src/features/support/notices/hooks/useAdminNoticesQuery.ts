import { useQuery } from "@tanstack/react-query";
import { AdminNoticeQuery } from "../types/admin-search";
import { getAdminNoticesAction } from "../actions/getAdminNoticesAction";

export function useAdminNoticesQuery(query: AdminNoticeQuery) {
  return useQuery({
    queryKey: ["admin-notices", query],
    queryFn: () => getAdminNoticesAction(query),
    placeholderData: (previousData) => previousData, // 페이지 이동 시 깜빡임 방지
  });
}
