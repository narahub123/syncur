"use server";

import { feedService } from "../service/FeedService.instance";
import { requireAuth } from "@/shared/lib/auth/requireAuth";

export async function getListingPagesAction(siteId: string) {
  if (!siteId) return [];

  const session = await requireAuth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  return await feedService.getListingPages(siteId, userId);
}
