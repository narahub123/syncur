"use client";

import { Button } from "@/shared/components/ui/button";
import { useFeedDiscoveryStore } from "../store/feedDiscovery";
import { LoaderCircle } from "lucide-react";
import { FEED_STATUS_A11Y } from "../constants/feed-discovery";

const SubscribeButton = ({ isFetching }: { isFetching: boolean }) => {
  const uiState = useFeedDiscoveryStore((s) => s.uiState);

  const isLoading = uiState === "subscribing" || isFetching;

  /**
   * 버튼 활성 조건
   * - feed 존재
   * - feed_found 상태
   * - 로딩 아님
   */
  const isDisabled = isLoading;

  const handleClick = async () => {
    if (isDisabled) return;

    try {
      /**
       * TODO: 실제 API 연결
       * await subscribeFeed(feed)
       */

      // 성공 시
      useFeedDiscoveryStore.getState().setSubscribed();
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
