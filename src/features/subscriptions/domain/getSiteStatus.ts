export type SubscriptionStatus = "available" | "subscribed" | "not_supported";

/**
 * 사이트 상태를 도메인 규칙 기반으로 계산한다.
 *
 * 역할:
 * - UI가 아니라 "비즈니스 규칙" 기준으로 상태를 결정
 * - 구독 가능 여부 / 이미 구독 여부를 기반으로 상태 분류
 *
 * 상태 정의:
 * - available: 구독 가능한 상태
 * - subscribed: 이미 구독된 상태
 * - not_supported: 구독 불가능한 사이트
 *
 * @param site.canSubscribe - 해당 사이트가 구독 가능한지 여부
 * @param site.isSubscribed - 현재 사용자가 이미 구독했는지 여부
 */
export function getSiteStatus(site: {
  canSubscribe: boolean;
  isSubscribed: boolean;
}): SubscriptionStatus {
  // 이미 구독 중인 사이트
  if (site.isSubscribed) return "subscribed";

  // 구독 자체가 불가능한 사이트
  if (!site.canSubscribe) return "not_supported";

  // 기본적으로 구독 가능한 상태
  return "available";
}
