import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribeAction } from "../actions/subscribeAction";

/**
 * 구독 mutation 훅
 * - subscribeAction 호출
 * - 성공 시 context 자동 갱신
 */
export function useSubscribeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    // 실제 서버 호출
    mutationFn: (siteId: string) => subscribeAction(siteId),

    // 성공하면 데이터 다시 가져오기
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["site-subscription-context"],
      });
    },
  });
}
