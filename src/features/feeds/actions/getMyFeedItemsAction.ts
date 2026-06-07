"use server";

import { auth } from "@/auth";
import { feedService } from "@/features/feeds/service/FeedService.instance";

export async function getMyFeedItemsAction() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      data: [],
      error: "UNAUTHORIZED",
    };
  }

  const userId = session.user.id;

  try {
    const data = await feedService.getMyFeedItems(userId);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("[getMyFeedItems]", error);

    return {
      success: false,
      data: [],
      error: "FEED_FETCH_FAILED",
    };
  }
}
