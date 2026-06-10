"use server";

import { auth } from "@/auth";
import { bookmarkCollectionService } from "../service/BookmarkCollectionService.instance";

/**
 * 컬렉션 이름 수정 Action
 *
 * 역할:
 * - 컬렉션 이름 변경
 * - FeedItem / Map과 무관
 */
export async function renameBookmarkCollectionAction(params: {
  collectionId: string;
  name: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const userId = session.user.id;

  return await bookmarkCollectionService.rename({
    userId,
    collectionId: params.collectionId,
    name: params.name,
  });
}
