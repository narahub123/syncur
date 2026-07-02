"use server";

import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { userKeywordService } from "../services/UserKeywordService.instance";

export async function deleteUserKeywordAction(userKeywordId: string) {
  await connectMongo();

  const session = await requireAuth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  return userKeywordService.deleteUserKeyword(userId, userKeywordId);
}
