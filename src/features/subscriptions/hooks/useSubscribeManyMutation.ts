import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribeManyAction } from "../actions/subscribeManyAction";
import { subscriptionQueryKey } from "../queries/subscriptionQueryKey";

export function useSubscribeManyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedIds: string[]) => {
      return await subscribeManyAction(feedIds);
    },

    onSuccess: () => {
      // 필요 시 관련 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: subscriptionQueryKey.all,
      });

      queryClient.invalidateQueries({
        queryKey: ["my-feed-items"],
      });
    },

    onError: (error) => {
      console.error("구독 실패", error);
    },
  });
}
