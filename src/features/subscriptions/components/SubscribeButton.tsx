"use client";

import { Button } from "@/shared/components/ui/button";
import { useFeedDiscoveryStore } from "../store/feedDiscovery";
import { LoaderCircle } from "lucide-react";
import { FEED_STATUS_A11Y } from "../constants/feed-discovery";

const SubscribeButton = () => {
  /**
   * UI 상태 (state machine 기반)
   * - feed_found 상태에서만 구독 가능
   * - subscribing 상태에서는 로딩 UI 표시
   */
  const uiState = useFeedDiscoveryStore((s) => s.uiState);

  /**
   * 구독 시작 액션
   * - UI state를 subscribing으로 전환
   * - 이후 API 호출 트리거 역할
   */
  const startSubscribe = useFeedDiscoveryStore((s) => s.startSubscribe);

  /**
   * 로딩 상태 여부
   * - 실제 구독 요청 진행 중인지 판단
   */
  const isLoading = uiState === "subscribing";

  /**
   * 버튼 비활성 조건
   * - feed_found 상태가 아닐 경우 (구독 불가능 상태)
   * - 또는 이미 구독 요청 진행 중일 경우
   */
  const isDisabled = uiState !== "feed_found" || isLoading;

  const handleClick = async () => {
    // 비활성 상태에서는 아무 동작도 하지 않음
    if (isDisabled) return;

    // 구독 프로세스 시작 (UI state: feed_found → subscribing)
    startSubscribe();

    try {
      // 실제 구독 API 호출 위치
      // ex) await subscribeFeed(selectedFeed)

      // 성공 시 UI state를 subscribed로 변경
      useFeedDiscoveryStore.getState().setSubscribed();
    } catch (e) {
      // 실패 시 에러 상태로 전환
      useFeedDiscoveryStore.getState().setError("subscribe failed");
    }
  };

  return (
    <Button onClick={handleClick} disabled={isDisabled} variant="default">
      {isLoading ? (
        <>
          <LoaderCircle
            size={12}
            className="animate-spin"
            role="status"
            aria-label={FEED_STATUS_A11Y.subscribing}
          />
          <span className="sr-only">구독 처리 중</span>
        </>
      ) : (
        "구독하기"
      )}
    </Button>
  );
};

export default SubscribeButton;
