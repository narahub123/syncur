import { useQuery } from "@tanstack/react-query";
import { subscriptionQueryKey } from "../queries/subscriptionQueryKey";
import { getSubscriptionsAction } from "../actions/getSubscriptionAction";

export const useSubscriptionsQuery = (page: number, limit: number) => {
  return useQuery({
    queryKey: subscriptionQueryKey.me(page, limit),

    /**
     * Server Action 호출
     */
    queryFn: () => getSubscriptionsAction(page, limit),
  });
};
