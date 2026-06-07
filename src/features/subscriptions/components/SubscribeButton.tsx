"use client";

import { Button } from "@/shared/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { SITE_SUBSCRIPTION_STATUS_A11Y } from "../constants/site-subscription-status";
import { useSiteSubscriptionStore } from "../store/siteSubscriptionStore";
import { useSubscribeMutation } from "@/features/subscriptions/hooks/useSubscribeMutation";

/**
 * 구독 버튼
 * - 선택된 사이트를 구독
 */
const SubscribeButton = ({ isFetching }: { isFetching: boolean }) => {
  const selectedSite = useSiteSubscriptionStore((s) => s.selectedSite);

  const subscribeMutation = useSubscribeMutation();

  // 로딩 상태
  const isLoading = isFetching || subscribeMutation.isPending;

  // 버튼 비활성 조건
  const isDisabled = isLoading || !selectedSite?.canSubscribe;

  // 클릭 처리
  const handleClick = () => {
    if (!selectedSite?.feedId) return;
    if (isDisabled) return;

    subscribeMutation.mutate(selectedSite.feedId);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      aria-busy={isLoading}
      className="w-18"
    >
      {isLoading ? (
        <>
          <LoaderCircle size={14} className="animate-spin" />
          <span className="sr-only">
            {SITE_SUBSCRIPTION_STATUS_A11Y.processing}
          </span>
        </>
      ) : (
        "구독하기"
      )}
    </Button>
  );
};

export default SubscribeButton;
