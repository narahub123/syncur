"use server";

import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { NotifyFilter } from "../constants/notify-filter";
import { userKeywordSettingService } from "../services/UserKeywordSettingService.instance";

export async function updateNotifyFilterAction(notifyFilter: NotifyFilter) {
  const session = await requireAuth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const userId = session.user.id;

  return userKeywordSettingService.updateNotifyFilter(userId, notifyFilter);
}
