"use server";

import { auth } from "@/auth";
import { bookmarkCollectionService } from "../service/BookmarkCollectionService.instance";

/**
 * 컬렉션 삭제 Action
 *
 * 역할:
 * - 컬렉션 삭제
 * - 관련 Map 제거 (중요)
 */
export async function deleteBookmarkCollectionAction(params: {
  collectionId: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const userId = session.user.id;

  return await bookmarkCollectionService.delete({
    userId,
    collectionId: params.collectionId,
  });
}
