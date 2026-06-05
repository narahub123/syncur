"use client";

import { Button } from "@/shared/components/ui/button";
import { useFeedDiscoveryStore } from "../store/feedDiscovery";
import { LoaderCircle } from "lucide-react";
import { FEED_STATUS_A11Y } from "../constants/feed-discovery";
import { subscribeController } from "../controllers/subscribeController";

const SubscribeButton = ({ isFetching }: { isFetching: boolean }) => {
  const uiState = useFeedDiscoveryStore((s) => s.uiState);
  const selectedSite = useFeedDiscoveryStore((s) => s.selectedSite);
  const inputValue = useFeedDiscoveryStore((s) => s.inputValue);

  const isLoading = uiState === "subscribing" || isFetching;

  /**
   * 버튼 활성 조건
   * - feed 존재
   * - feed_found 상태
   * - 로딩 아님
   */
  const isDisabled =
    isLoading || (!!selectedSite && !selectedSite.feed_url) || !inputValue;

  const handleClick = async () => {
    if (isDisabled) return;

    try {
      await subscribeController();
    } catch (e) {
      useFeedDiscoveryStore.getState().setError("subscribe failed");
      console.error("구독 실패", e);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      aria-busy={isLoading}
      variant="default"
    >
      {isLoading ? (
        <>
          <LoaderCircle size={12} className="animate-spin" aria-hidden="true" />
          <span className="sr-only">{FEED_STATUS_A11Y.subscribing}</span>
        </>
      ) : (
        "구독하기"
      )}
    </Button>
  );
};

export default SubscribeButton;
