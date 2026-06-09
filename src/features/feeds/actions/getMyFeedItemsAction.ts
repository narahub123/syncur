"use server";

import { auth } from "@/auth";
import { feedService } from "@/features/feeds/service/FeedService.instance";
import { FeedActionResponse } from "../dto/feedDto";

/**
 * 사용자 피드 조회 Server Action
 *
 * - 로그인 사용자 기준 feed item 목록을 cursor 기반으로 조회
 * - infinite scroll을 지원하기 위한 pagination 구조 반환
 */
export async function getMyFeedItemsAction(
  cursor?: string, // 이전 페이지의 nextCursor (없으면 첫 페이지)
): Promise<FeedActionResponse> {
  // 현재 로그인 세션 조회
  const session = await auth();

  // 로그인되지 않은 경우: 인증 실패 응답
  if (!session?.user?.id) {
    return {
      success: false,
      data: {
        items: [],
        nextCursor: null,
        hasNext: false,
        status: "UNAUTHORIZED",
      },
      error: "UNAUTHORIZED",
    };
  }

  const userId = session.user.id;

  try {
    // 실제 feed 데이터 조회 (cursor 기반 pagination 포함)
    const data = await feedService.getMyFeedItems(userId, cursor);

    // 정상 응답
    return {
      success: true,
      data,
    };
  } catch (error) {
    // 서버 또는 DB 에러 처리
    console.error("[getMyFeedItems]", error);

    // 실패 응답 (UI fallback 가능하도록 기본 구조 유지)
    return {
      success: false,
      data: {
        items: [],
        nextCursor: null,
        hasNext: false,
        status: "FEED_FETCH_FAILED",
      },
      error: "FEED_FETCH_FAILED",
    };
  }
}
