export const subscriptionQueryKey = {
  /**
   * subscriptions 관련 모든 query의 root key
   * - 캐시 무효화 범위 지정 시 사용
   * - 예: invalidateQueries({ queryKey: subscriptionQueryKey.all })
   */
  all: ["subscriptions"] as const,

  /**
   * 현재 로그인한 사용자의 구독 목록 query key
   * - 실제 데이터는 user 기준이므로 반드시 세분화된 key 사용
   * - 동일 사용자 캐시 재사용 목적
   */
  me: () => ["subscriptions", "me"] as const,
};
