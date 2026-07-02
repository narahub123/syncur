"use server";

import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { userFeedSettingService } from "../services/UserFeedSettingService.instance";
import { NotifyFilter } from "../constants/notify-filter";

export async function updateNotifyFilterAction(params: {
  subscriptionId: string;
  notifyFilter: NotifyFilter;
}) {
  await connectMongo();

  const session = await requireAuth();

  if (!session) throw new Error("Unauthorized");

  const userId = session.user.id;

  return userFeedSettingService.updateNotifyFilter({ ...params, userId });
}
