import { useMutation, useQueryClient } from "@tanstack/react-query";

import { subscriptionQueryKey } from "../queries/subscriptionQueryKey";
import { unsubscribeAction } from "../actions/unsubscribeAction";

export function useUnsubscribeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedId: string) => {
      return await unsubscribeAction(feedId);
    },

    onSuccess: async () => {
      // 1. subscription 목록 갱신 (있다면)
      await queryClient.invalidateQueries({
        queryKey: subscriptionQueryKey.all,
      });

      // 2. feed 재조회 (핵심)
      await queryClient.invalidateQueries({
        queryKey: ["my-feed-items"],
      });
    },
  });
}
