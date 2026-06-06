import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribeAction } from "../actions/subscribeAction";
import { unsubscribeAction } from "../actions/unsubscribeAction";

export function useSubscriptionToggleMutation() {
  return useMutation({
    mutationFn: async (params: { siteId: string; isSubscribed: boolean }) => {
      const { siteId, isSubscribed } = params;

      if (isSubscribed) {
        return unsubscribeAction(siteId);
      }

      return subscribeAction(siteId);
    },

    onSuccess: () => {},
  });
}
