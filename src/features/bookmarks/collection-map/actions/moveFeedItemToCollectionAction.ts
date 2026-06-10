"use server";

import { auth } from "@/auth";
import { bookmarkCollectionMapService } from "../service/BookmarkCollectionMapService.instance";

/**
 * FeedItem 컬렉션 이동
 *
 * 역할:
 * - 기존 컬렉션 → 새로운 컬렉션으로 이동
 */
export async function moveFeedItemToCollectionAction(params: {
  feedItemId: string;
  fromCollectionId: string;
  toCollectionId: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const userId = session.user.id;

  return await bookmarkCollectionMapService.moveToCollection({
    userId,
    feedItemId: params.feedItemId,
    fromCollectionId: params.fromCollectionId,
    toCollectionId: params.toCollectionId,
  });
}
