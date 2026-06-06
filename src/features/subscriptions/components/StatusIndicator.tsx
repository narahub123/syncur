"use client";

import { useFeedDiscoveryStore } from "../store/feedDiscovery";
import {
  FEED_STATUS_MESSAGE,
  FEED_STATUS_A11Y,
} from "../constants/feed-discovery";
import { cn } from "@/shared/utils/cn";

/**
 * StatusIndicator
 *
 * 역할:
 * - UIState를 사용자 메시지로 변환하여 표시
 * - 접근성(aria-live) 메시지 제공
 * - 상태 변화에 따른 UX 피드백 중앙 집중 처리
 */
const StatusIndicator = () => {
  const uiState = useFeedDiscoveryStore((s) => s.uiState);

  // 현재 상태에 대한 사용자 메시지
  const message = FEED_STATUS_MESSAGE[uiState];

  // 접근성용 메시지 (screen reader)
  const a11yMessage = FEED_STATUS_A11Y[uiState];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="flex h-6 flex-col gap-1 px-2"
    >
      {/* 사용자 UI 메시지 */}
      <p
        className={cn(
          "text-xs font-medium",
          uiState === "not_supported" || uiState === "error"
            ? "text-red-400"
            : "text-gray-600",
        )}
      >
        {message}
      </p>

      {/* 스크린리더 전용 메시지 */}
      <span className="sr-only">{a11yMessage}</span>
    </div>
  );
};

export default StatusIndicator;
