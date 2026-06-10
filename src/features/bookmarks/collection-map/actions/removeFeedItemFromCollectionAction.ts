"use server";

import { auth } from "@/auth";
import { bookmarkCollectionMapService } from "../service/BookmarkCollectionMapService.instance";

/**
 * FeedItem을 컬렉션에서 제거
 *
 * 역할:
 * - 북마크 해제
 * - 관계 삭제
 */
export async function removeFeedItemFromCollectionAction(params: {
  feedItemId: string;
  collectionId: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const userId = session.user.id;

  await bookmarkCollectionMapService.removeFromCollection({
    userId,
    feedItemId: params.feedItemId,
    collectionId: params.collectionId,
  });
}
