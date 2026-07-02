"use server";

import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { userKeywordService } from "../services/UserKeywordService.instance";

export async function getUserKeywordDetailAction(keywordId: string) {
  const session = await requireAuth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const userId = session.user.id;

  return userKeywordService.getUserKeywordDetail({
    userId,
    userKeywordId: keywordId,
  });
}
