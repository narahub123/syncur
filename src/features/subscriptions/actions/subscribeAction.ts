"use server";

import { auth } from "@/auth";
import { subscriptionService } from "../services/SubscriptionService.instance";

/**
 * subscribeAction
 * - DB에 존재하는 site를 user subscription으로 연결하는 server action
 * - 인증 + 서비스 브릿지 역할
 */
export async function subscribeAction(siteId: string) {
  if (!siteId) {
    throw new Error("siteId is required");
  }

  /**
   * 현재 로그인 사용자 조회 (NextAuth v5)
   */
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return await subscriptionService.create({
    userId,
    siteId,
  });
}
