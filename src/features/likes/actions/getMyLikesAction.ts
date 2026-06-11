"use server";

import { auth } from "@/auth";
import { FeedActionResponse } from "@/features/feeds/dto/feedDto";
import { likeService } from "../service/LikeService.instance";

/**
 * 사용자 좋아요 피드 조회 Server Action
 *
 * - 로그인 사용자 기준
 * - "구독 feed scope + 좋아요 필터"가 적용된 feed item 목록 조회
 * - cursor 기반 infinite scroll 지원
 *
 * 구조 특징:
 * - feed action과 동일한 response contract 유지
 * - 내부 service만 like 필터링 pipeline 사용
 */
export async function getMyLikesAction(
  cursor?: string,
): Promise<FeedActionResponse> {
  // =========================
  // 1. 인증 체크
  // =========================
  const session = await auth();

  // 로그인되지 않은 경우
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
    // =========================
    // 2. like 기반 feed 조회
    // =========================
    // - subscription 기반 feed scope 유지
    // - interaction(hasLiked) 필터 적용된 feed 반환
    const data = await likeService.getMyLikes(userId, cursor);

    // =========================
    // 3. 정상 응답
    // =========================
    return {
      success: true,
      data,
    };
  } catch (error) {
    // =========================
    // 4. 에러 처리
    // =========================
    console.error("[getMyLikesAction]", error);

    return {
      success: false,
      data: {
        items: [],
        nextCursor: null,
        hasNext: false,
        status: "LIKE_FEED_FETCH_FAILED",
      },
      error: "LIKE_FEED_FETCH_FAILED",
    };
  }
}
