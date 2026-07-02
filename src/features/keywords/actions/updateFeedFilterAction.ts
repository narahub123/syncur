"use server";

import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { FeedFilter } from "../constants/feed-filter";
import { userKeywordSettingService } from "../services/UserKeywordSettingService.instance";

export async function updateFeedFilterAction(feedFilter: FeedFilter) {
  const session = await requireAuth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const userId = session.user.id;

  return userKeywordSettingService.updateFeedFilter(userId, feedFilter);
}
