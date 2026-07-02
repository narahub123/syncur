"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { userFeedSettingService } from "../services/UserFeedSettingService.instance";
import { requireAuth } from "@/shared/lib/auth/requireAuth";

export async function getUserFeedSettingAction(subscriptionId: string) {
  await connectMongo();

  const session = await requireAuth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  return userFeedSettingService.getBySubscriptionId(userId, subscriptionId);
}
