import { useQuery } from "@tanstack/react-query";
import { getUserByIdAction } from "../actions/getUserByIdAction";

export function useUserById(userId: string) {
  return useQuery({
    // 관리자 조회용 키로 명확히 분리
    queryKey: ["admin", "users", userId],
    queryFn: () => getUserByIdAction(userId),
    // 관리자 페이지는 데이터의 최신성이 중요하므로 staleTime을 짧게 설정하거나 0으로 둡니다.
    staleTime: 0,
    enabled: !!userId,
  });
}
