"use server";

import { auth } from "@/auth";
import { bookmarkCollectionService } from "../service/BookmarkCollectionService.instance";
import { bookmarkCollectionMapService } from "../../collection-map/service/BookmarkCollectionMapService.instance";

/**
 * 컬렉션 생성 + FeedItem 저장 (통합 Action)
 *
 * 역할:
 * - 컬렉션 생성
 * - FeedItem ↔ Collection 매핑 생성
 * - “저장” 단일 UX 처리
 */
export async function createCollectionAndAttachFeedItemAction(params: {
  feedItemId: string;
  name: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const userId = session.user.id;

  // 1. 컬렉션 생성
  const collection = await bookmarkCollectionService.create({
    userId,
    name: params.name,
  });

  // 2. Map 생성 (즉시 연결)
  const map = await bookmarkCollectionMapService.addToCollection({
    userId,
    feedItemId: params.feedItemId,
    collectionId: collection._id,
  });

  return {
    collection,
    map,
  };
}
