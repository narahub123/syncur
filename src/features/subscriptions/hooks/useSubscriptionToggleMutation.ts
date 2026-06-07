import { useMutation } from "@tanstack/react-query";
import { subscribeAction } from "../actions/subscribeAction";
import { unsubscribeAction } from "../actions/unsubscribeAction";

export function useSubscriptionToggleMutation() {
  return useMutation({
    mutationFn: async (params: { feedId: string; isSubscribed: boolean }) => {
      const { feedId, isSubscribed } = params;

      if (isSubscribed) {
        return unsubscribeAction(feedId);
      }

      return subscribeAction(feedId);
    },

    onSuccess: () => {},
  });
}
