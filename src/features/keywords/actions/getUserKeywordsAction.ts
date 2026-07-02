"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { userKeywordService } from "../services/UserKeywordService.instance";
import { requireAuth } from "@/shared/lib/auth/requireAuth";

export async function getUserKeywordsAction() {
  await connectMongo();

  const session = await requireAuth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  return userKeywordService.getUserKeywords(userId);
}
