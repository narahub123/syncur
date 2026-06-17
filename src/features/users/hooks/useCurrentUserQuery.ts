import { useQuery } from "@tanstack/react-query";
import { getCurrentUserAction } from "../actions/getCurrentUserAction";

export function useCurrentUserQuery() {
  return useQuery({
    // "me"라는 키를 사용하여 현재 로그인한 사용자임을 명시
    queryKey: ["user", "me"],
    queryFn: () => getCurrentUserAction(),
    // 사용자 정보는 아주 빈번하게 바뀌지 않으므로 staleTime을 적절히 설정
    staleTime: 1000 * 60 * 5, // 5분
    // 세션이 만료되거나 할 수 있으므로 필요에 따라 재시도 설정 가능
    retry: 1,
  });
}
