import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribeAction } from "../actions/subscribeAction";
import { useSiteSubscriptionStore } from "../store/siteSubscriptionStore";
import { subscriptionQueryKey } from "../queries/subscriptionQueryKey";

/**
 * 구독 mutation 훅
 * - subscribeAction 호출
 * - 성공 시 context 자동 갱신
 * - UI 상태 동기화
 */
export function useSubscribeMutation() {
  const queryClient = useQueryClient();

  const selectedSite = useSiteSubscriptionStore((s) => s.selectedSite);
  const selectSite = useSiteSubscriptionStore((s) => s.selectSite);
  const setProcessing = useSiteSubscriptionStore((s) => s.setProcessing);

  const setSubscribed = useSiteSubscriptionStore((s) => s.setSubscribed);

  const setAlreadySubscribed = useSiteSubscriptionStore(
    (s) => s.setAlreadySubscribed,
  );

  const setError = useSiteSubscriptionStore((s) => s.setError);

  return useMutation({
    /**
     * mutation 시작
     */
    onMutate: () => {
      setProcessing();
    },

    /**
     * 실제 서버 호출
     */
    mutationFn: (siteId: string) => subscribeAction(siteId),

    /**
     * 성공 처리
     */
    onSuccess: (result) => {
      if (result.status === "subscribed") {
        setSubscribed();
      }

      if (result.status === "already_subscribed") {
        setAlreadySubscribed();
      }

      queryClient.invalidateQueries({
        queryKey: subscriptionQueryKey.all,
      });

      if (!selectedSite) return;

      const updatedSite = {
        ...selectedSite,
        isSubscribed: result.status === "subscribed",
        canSubscribe: result.status !== "subscribed",
      };

      selectSite(updatedSite);
    },

    /**
     * 실패 처리
     */
    onError: (error) => {
      setError(
        error instanceof Error
          ? error.message
          : "구독 처리 중 오류가 발생했습니다.",
      );
    },
  });
}
