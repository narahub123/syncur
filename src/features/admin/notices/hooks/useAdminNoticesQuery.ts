import { useQuery } from "@tanstack/react-query";
import { getAdminNoticesAction } from "../actions/getAdminNoticesAction";
import { AdminNoticeQuery } from "@/features/admin/notices/types/search";

export function useAdminNoticesQuery(query: AdminNoticeQuery) {
  return useQuery({
    queryKey: ["admin-notices", query],
    queryFn: () => getAdminNoticesAction(query),
    placeholderData: (previousData) => previousData, // 페이지 이동 시 깜빡임 방지
  });
}
