"use server";

import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { userKeywordSettingService } from "../services/UserKeywordSettingService.instance";

export async function getUserKeywordSettingAction() {
  const session = await requireAuth();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  const userId = session.user.id;

  return userKeywordSettingService.getByUserId(userId);
}
