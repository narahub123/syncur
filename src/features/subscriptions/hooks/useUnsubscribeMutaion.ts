import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unsubscribeAction } from "../actions/unsubscribeAction";
import { subscriptionQueryKey } from "../queries/subscriptionQueryKey";

/**
 * 구독 해제 mutation 훅
 *
 * @description
 * 특정 사이트에 대한 구독을 해제하는 서버 액션을 실행하고,
 * 성공 시 구독 목록 캐시를 무효화하여 UI를 최신 상태로 유지한다.
 *
 * @layer
 * Client (React Query Mutation)
 *
 * @flow
 * UI → useUnsubscribeMutation → unsubscribeAction → Server → DB → invalidate → refetch
 *
 * @notes
 * - 단일 구독 해제용 명시적 액션 (toggle과 별도 역할)
 * - 구독 목록 페이지 및 관리 UI에서 재사용 가능
 * - 성공 후 subscription 목록(queryKey: all) 자동 갱신
 */
export const useUnsubscribeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * 실제 서버에서 구독 해제 처리
     */
    mutationFn: unsubscribeAction,

    /**
     * 성공 시 구독 목록 캐시 무효화
     * → 최신 구독 상태로 자동 refetch 유도
     */
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionQueryKey.all,
      });
    },
  });
};