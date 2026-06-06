import { SiteSubscriptionState } from "../types/site-subscription-status";

/**
 * UI 상태별 스크린리더(A11y) 전용 문구 매핑
 *
 * 역할:
 * - screen reader에게 현재 UI 상태를 설명
 * - aria-live / role=status와 함께 사용
 * - UI 의미를 짧게 전달
 */
export const SITE_SUBSCRIPTION_STATUS_A11Y: Record<
  SiteSubscriptionState,
  string
> = {
  idle: "대기 상태",
  processing: "구독 처리 중",
  subscribed: "구독 완료",
  already_subscribed: "중복 구독",
  not_supported: "지원 불가",
  error: "오류 상태",
} as const;

/**
 * UI 상태별 사용자 표시 메시지 매핑
 *
 * 역할:
 * - 화면에 보여지는 상태 메시지 정의
 * - StatusIndicator 등 UI 공통 메시지 표준화
 */
export const SITE_SUBSCRIPTION_STATUS_MESSAGE: Record<
  SiteSubscriptionState,
  string
> = {
  idle: "",
  processing: "구독을 처리하고 있습니다",
  subscribed: "구독이 완료되었습니다",
  already_subscribed: "이미 구독된 사이트입니다",
  not_supported: "RSS를 지원하지 않는 사이트입니다.",
  error: "오류가 발생했습니다",
} as const;
