"use server";

import { auth } from "@/auth";
import { BookmarkCollectionMapService } from "@/features/bookmarks/collection-map/service/BookmarkCollectionMapService";

const service = new BookmarkCollectionMapService();

export async function removeBookmarkCollectionMapAction(params: {
  feedItemId: string;
  collectionId: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const userId = session.user.id;

  await service.removeFromCollection({ ...params, userId });

  return {
    success: true,
  };
}
