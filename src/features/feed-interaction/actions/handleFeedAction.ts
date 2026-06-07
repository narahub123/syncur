"use server";

import { auth } from "@/auth";
import { FeedActionDispatcher } from "../dispatcher/FeedActionDispatcher";
import { FeedAction } from "../types/feedActionDispatcher";

/**
 * Feed Server Action
 *
 * 역할:
 * - UI에서 발생한 Feed action을 서버로 전달
 * - Dispatcher를 호출하는 단일 entry point
 *
 * 특징:
 * - business logic 없음 (절대 금지)
 * - validation + orchestration only
 */
const dispatcher = new FeedActionDispatcher();

/**
 * Feed Action Server Entry
 */
export async function handleFeedAction(params: {
  feedItemId: string;
  action: FeedAction;
}) {
  const { feedItemId, action } = params;

  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  /**
   * 1. 기본 validation
   * - 빈 값 방지
   */
  if (!userId || !feedItemId || !action) {
    throw new Error("Invalid feed action request");
  }

  /**
   * 2. Dispatcher로 전달
   *
   * 실제 비즈니스 로직은 모두 dispatcher 내부에서 처리
   */
  await dispatcher.handle({
    userId,
    feedItemId,
    action,
  });

  /**
   * 3. 응답
   * - 필요 최소 정보만 반환
   */
  return {
    success: true,
  };
}
