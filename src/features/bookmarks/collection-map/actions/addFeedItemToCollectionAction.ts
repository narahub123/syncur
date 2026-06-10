"use server";

import { auth } from "@/auth";
import { bookmarkCollectionMapService } from "../service/BookmarkCollectionMapService.instance";

/**
 * FeedItem을 컬렉션에 추가 (북마크 확정)
 *
 * 역할:
 * - FeedItem ↔ Collection 관계 생성
 * - 실제 "저장 완료" 단계
 */
export async function addFeedItemToCollectionAction(params: {
  feedItemId: string;
  collectionId: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const userId = session.user.id;

  return await bookmarkCollectionMapService.addToCollection({
    userId,
    feedItemId: params.feedItemId,
    collectionId: params.collectionId,
  });
}
