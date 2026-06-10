"use server";

import { auth } from "@/auth";
import { bookmarkService } from "../service/BookmarksService.instance";
import { BookmarkActionResponse } from "../dto/bookmarkDto";
import { connectMongo } from "@/shared/lib/db/mongoose";

/**
 * 북마크 목록 조회 Server Action
 *
 * Feed와 동일한 구조를 유지해야 한다
 */
export async function getBookmarksAction(
  cursor?: string,
): Promise<BookmarkActionResponse> {
  connectMongo();

  const session = await auth();

  // =========================
  // 인증 실패
  // =========================
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
    // Service 호출 (Feed와 동일 구조 반환)
    // =========================
    const data = await bookmarkService.getBookmarks(userId, cursor);

    console.log("action data", data);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("[getBookmarksAction]", error);

    return {
      success: false,
      data: {
        items: [],
        nextCursor: null,
        hasNext: false,
        status: "BOOKMARK_FETCH_FAILED",
      },
      error: "BOOKMARK_FETCH_FAILED",
    };
  }
}
