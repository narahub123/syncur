import { useQuery } from "@tanstack/react-query";
import { subscriptionQueryKey } from "../queries/subscriptionQueryKey";
import { getSubscriptionsAction } from "../actions/getSubscriptionAction";

export const useSubscriptionsQuery = () => {
  return useQuery({
    queryKey: subscriptionQueryKey.me(),

    /**
     * Server Action 호출
     * - 내부에서 auth 실패 또는 서버 문제 발생 시 throw 가능
     * - TanStack Query가 자동으로 error 상태로 전환함
     */
    queryFn: () => getSubscriptionsAction(),
  });
};
