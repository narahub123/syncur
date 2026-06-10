"use server";

import { auth } from "@/auth";
import { bookmarkCollectionService } from "../service/BookmarkCollectionService.instance";

/**
 * 컬렉션 교체 Action
 *
 * 역할:
 * - 기존 컬렉션 선택
 * - 신규 컬렉션 생성
 * - FeedItem 컬렉션 이동
 */
export async function replaceBookmarkCollectionAction(params: {
  feedItemId: string;

  currentCollectionId: string;

  nextCollectionId?: string;
  nextCollectionName?: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const userId = session.user.id;

  return await bookmarkCollectionService.replaceCollection({
    userId,
    feedItemId: params.feedItemId,
    currentCollectionId: params.currentCollectionId,
    nextCollectionId: params.nextCollectionId,
    nextCollectionName: params.nextCollectionName,
  });
}
