"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { FeedFilter } from "../constants/feed-filter";
import { userFeedSettingService } from "../services/UserFeedSettingService.instance";
import { requireAuth } from "@/shared/lib/auth/requireAuth";

export async function updateFeedFilterAction(params: {
  subscriptionId: string;
  feedFilter: FeedFilter;
}) {
  await connectMongo();

  const session = await requireAuth();

  if (!session) throw new Error("Unauthorized");

  const userId = session.user.id;

  return userFeedSettingService.updateFeedFilter({ ...params, userId });
}
