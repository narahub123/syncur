"use server";

import { auth } from "@/auth";
import { subscriptionService } from "../services/SubscriptionService.instance";

/**
 * 구독 해제 Server Action
 *
 * @description
 * 클라이언트에서 전달된 siteId를 기반으로
 * 현재 로그인된 사용자의 구독을 해제한다.
 *
 * 인증된 사용자 세션을 확인한 뒤,
 * SubscriptionService를 통해 DB에서 구독 관계를 삭제한다.
 *
 * @layer
 * Server Action (Next.js Server Actions)
 *
 * @flow
 * Client
 *   → unsubscribeAction(siteId)
 *   → auth()로 사용자 인증 확인
 *   → SubscriptionService.unsubscribe
 *   → Repository → DB delete
 *
 * @param siteId - 구독 해제 대상 사이트 ID
 *
 * @throws
 * UNAUTHORIZED - 로그인되지 않은 경우
 *
 * @returns
 * 삭제 결과 (Service → Repository 반환값)
 */
export const unsubscribeAction = async (siteId: string) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  return subscriptionService.unsubscribe(session.user.id, siteId);
};
